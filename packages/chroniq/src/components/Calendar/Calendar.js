import PropTypes from 'prop-types'
import React from 'react'
import { createPortal } from 'react-dom'
import Immutable from 'immutable'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import invariant from 'invariant'
import dates from '../../utils/dates'
import { createStore } from '../../store'
import { Provider } from '../../store/Provider'
import { get, length } from '@chroniq/chroniq-accessor-helpers'

import {
  updateProps,
  splitResource,
  navigate,
  SELECT_EVENT_ACTION,
  DOUBLE_CLICK_EVENT_ACTION,
  SELECT_BACKGROUND_EVENT_ACTION,
  SELECT_SLOT_ACTION,
  SET_VIEW_ACTION,
  NAVIGATE_ACTION,
  JOIN_RESOURCE_ACTION,
  SPLIT_RESOURCE_ACTION,
  EVENT_DROP_ACTION,
  EVENT_DRAG_ACTION,
  EVENT_DRAG_BEGIN_ACTION,
  EVENT_RESIZE_BEGIN_ACTION,
  EVENT_RESIZING_ACTION,
  EVENT_RESIZE_ACTION
} from '../../store/actions'

import {
  getSelectedEvents,
  getJoinedResources,
  isDragging,
  isDragInside
} from '../../store/selectors'

import { views } from '../../utils/constants'
import defaultFormats from '../../formats'
import VIEWS from '../../utils/views'
import CalendarContainer from './CalendarContainer.js'
import Toolbar from '../Toolbar/Toolbar'
import MainView from '../MainView/MainView'

import {
  defaultsDeep,
  transform,
  mapValues,
  classNames
} from '../../utils/helpers'

import layoutStrategy from '@chroniq/chroniq-layout-strategy-default'
import { accessors, mutators } from '@chroniq/chroniq-accessors-object'

import {
  createControllableActions
} from '../../store/controllableActions'

import { prepareResources } from '../../models/resource.js'
import { prepareBusinessHours } from '../../models/businessHours.js'
import { prepareEvents } from '../../models/event.js'
import { prepareMessages } from '../../models/message.js'

function viewNames (_views) {
  return !length(_views) ? Object.keys(_views) : _views.map((view) => view.toString())
}

class Calendar extends React.PureComponent {
  constructor (props) {
    super(props)
    let { middleware, addActionHandlers, removeActionHandlers } = createControllableActions()

    this.addActionHandlers = addActionHandlers
    this.removeActionHandlers = removeActionHandlers

    this.store = createStore(middleware)
  }
  componentWillMount () {
    this.updateProps({
      resources: false,
      backgroundEvents: false,
      formats: false,
      messages: false,
      components: false,
      joinedResources: false
    }, this.props)
  }

  componentWillReceiveProps (nextProps, nextState) {
    this.updateProps(this.props, nextProps, nextState)
  }

  reduxProps = [
    'popup',
    'views',
    'view',
    'selectable',
    'culture',
    'joinedResources',
    'activeResources',
    'snapDuration',
    'enableEventPopup',
    'hoverOnEventPopup',
    'eventPopupDirection',
    'moveToolbarToRef'
  ]

  dragAndDropSelector = (state, action) => {
    if (!isDragInside(state)) {
      return false
    }

    const { accessors, step } = this.props

    const startOffset = state.getIn([ 'dnd', 'startOffset' ])
    const endOffset = state.getIn([ 'dnd', 'endOffset' ])
    const originalResourceId = state.getIn([ 'dnd', 'draggedEvent', 'resourceId' ])
    const resourceId = state.getIn([ 'dnd', 'resourceId' ])

    const affectedEventIds = state.getIn([ 'dnd', 'previews' ])
    const affectedEvents = affectedEventIds.map((id) => {
      const event = this.props.events.find((event) => get(event, accessors.event.id) === id)
      const start = dates.add(get(event, accessors.event.start), startOffset, 'minutes')
      const end = dates.add(get(event, accessors.event.end), endOffset, 'minutes')

      return {
        ...event,
        resourceId: resourceId === originalResourceId ? get(event, accessors.event.resourceId) : resourceId,
        start,
        end: start < end ? end : dates.add(start, step, 'minutes')
      }
    })

    return {
      events: affectedEvents.toArray(),
      state: state.toJS().props
    }
  }

  handlerToActionMapping = {
    'onSelectEvent': {
      controlledProp: 'selectedEvents',
      actions: [ SELECT_EVENT_ACTION ],
      selector: (state) => getSelectedEvents(state),
      controlled: {
        selector: null
      }
    },
    'onDoubleClickEvent': {
      actions: [ DOUBLE_CLICK_EVENT_ACTION ]
    },
    'onSelectBackgroundEvent': {
      actions: [ SELECT_BACKGROUND_EVENT_ACTION ]
    },
    'onSelectSlot': {
      actions: [ SELECT_SLOT_ACTION ]
    },
    'onViewChange': {
      controlledProp: 'view',
      actions: [ SET_VIEW_ACTION ]
    },
    'onDateChange': {
      controlledProp: 'date',
      actions: [ NAVIGATE_ACTION ]
    },
    'onChangeJoinedResources': {
      actions: [
        JOIN_RESOURCE_ACTION,
        SPLIT_RESOURCE_ACTION
      ],
      selector: getJoinedResources
    },
    'onEventDrop': {
      actions: [ EVENT_DROP_ACTION ],
      selector: this.dragAndDropSelector
    },
    'onEventDrag': {
      actions: [ EVENT_DRAG_ACTION ],
      selector: this.dragAndDropSelector
    },
    'onEventDragBegin': {
      actions: [ EVENT_DRAG_BEGIN_ACTION ]
    },
    'onEventResizeBegin': {
      actions: [ EVENT_RESIZE_BEGIN_ACTION ]
    },
    'onEventResizing': {
      actions: [ EVENT_RESIZING_ACTION ],
      selector: this.dragAndDropSelector
    },
    'onEventResize': {
      actions: [ EVENT_RESIZE_ACTION ],
      selector: this.dragAndDropSelector
    }
  }

  updateProps = (currentProps, nextProps) => {
    Object.keys(this.handlerToActionMapping)
      .filter((handlerName) => currentProps[handlerName] !== nextProps[handlerName])
      .forEach((handlerName) => {
        const mapping = this.handlerToActionMapping[handlerName]
        const shouldIntercept = mapping.hasOwnProperty('controlledProp') && typeof nextProps[mapping.controlledProp] !== 'undefined'
        const selector = shouldIntercept && mapping.hasOwnProperty('controlled')
          ? mapping.controlled.selector
          : mapping.selector

        if (typeof currentProps[handlerName] !== 'function') {
          this.addActionHandlers(mapping.actions, nextProps[handlerName], mapping.selector, shouldIntercept)
        } else if (typeof nextProps[handlerName] !== 'function') {
          this.removeActionHandlers(mapping.actions)
        } else {
          this.removeActionHandlers(mapping.actions)
          this.addActionHandlers(mapping.actions, nextProps[handlerName], mapping.selector, shouldIntercept)
        }
      })

    let changedProps = Immutable.Map()
      .withMutations((changedProps) =>
        this.reduxProps
          .filter((key) => nextProps[key] !== currentProps[key])
          .reduce((result, key) => result.set(key, nextProps[key]), changedProps)
      )

    let date = dates.startOf(nextProps.date, 'day')
    if (nextProps.date && +date !== +dates.startOf(currentProps.date, 'day')) {
      changedProps = changedProps.set('date', date)
    }

    if (nextProps.minTime && +nextProps.minTime !== +currentProps.minTime) {
      changedProps = changedProps.set('minTime', nextProps.minTime)
    }

    if (nextProps.maxTime && +nextProps.maxTime !== +currentProps.maxTime) {
      changedProps = changedProps.set('maxTime', nextProps.maxTime)
    }

    if (nextProps.scrollTime && +nextProps.scrollTime !== +currentProps.scrollTime) {
      changedProps = changedProps.set('scrollTime', nextProps.scrollTime)
    }

    let accessors = currentProps.accessors
    if (nextProps.accessors !== currentProps.accessors) {
      accessors = this.prepareAccessors(nextProps.accessors)
      this.setState({
        accessors
      })
    }

    let mutators = currentProps.mutators
    if (nextProps.mutators !== currentProps.mutators) {
      mutators = this.prepareMutators(nextProps.mutators)
      this.setState({
        mutators
      })
    }

    if (nextProps.selectedEvents !== currentProps.selectedEvents) {
      changedProps = changedProps.set('selectedEvents', Immutable.List(nextProps.selectedEvents))
        .set('events', prepareEvents(nextProps.events, accessors.event, nextProps.selectedEvents))
    }

    if (nextProps.formats !== currentProps.formats) {
      changedProps = changedProps.set('formats', Immutable.fromJS(defaultFormats(nextProps.formats || {})))
    }

    if (nextProps.messages !== currentProps.messages) {
      changedProps = changedProps.set('messages', prepareMessages(nextProps.messages || {}))
    }

    if (nextProps.events !== currentProps.events) {
      changedProps = changedProps.set('events', prepareEvents(nextProps.events, accessors.event, mutators.event, nextProps.selectedEvents))
    }

    if (nextProps.resources !== currentProps.resources) {
      changedProps = changedProps.set('resources', prepareResources(nextProps.resources, accessors.resource, mutators.resource))

      const removedResources = currentProps.resources && currentProps.resources
        .filter((resource) => !nextProps.resources.some((otherResource) => get(resource, accessors.resource.id) === get(otherResource, accessors.resource.id)))
      removedResources && removedResources.forEach((resource) => this.store.dispatch(splitResource(get(resource, accessors.resource.id))))
    }

    if (nextProps.backgroundEvents !== currentProps.backgroundEvents) {
      changedProps = changedProps.set('backgroundEvents', prepareEvents(nextProps.backgroundEvents, accessors.backgroundEvent, mutators.backgroundEvent))
    }

    if (nextProps.businessHours !== currentProps.businessHours) {
      changedProps = changedProps.set('businessHours', prepareBusinessHours(nextProps.businessHours, accessors.businessHours, mutators.businessHours))
    }

    if (nextProps.views !== currentProps.views) {
      changedProps = changedProps.set('names', viewNames(nextProps.views))
    }

    if (nextProps.slotInterval !== currentProps.slotInterval) {
      let slotInterval = +nextProps.slotInterval <= 0 ? 1 : +nextProps.slotInterval
      changedProps = changedProps.set('slotInterval', slotInterval)
    }

    if (nextProps.slotDuration !== currentProps.slotDuration) {
      let slotDuration = +nextProps.slotDuration <= 0 ? 1 : +nextProps.slotDuration
      changedProps = changedProps.set('slotDuration', slotDuration)
    }

    if (nextProps.components !== currentProps.components) {
      this.setState({
        components: nextProps.components || {}
      })
    }

    this.store.dispatch(updateProps(changedProps))
  }

  prepareAccessors = (accessors) => {
    return defaultsDeep({},
      accessors,
      Calendar.defaultProps.accessors
    )
  }

  prepareMutators = (mutators) => {
    return defaultsDeep({},
      mutators,
      Calendar.defaultProps.mutators
    )
  }

  calendars = []

  getViews = () => {
    const views = this.props.views

    if (length(views)) {
      return transform(views, (result, value) => {
        if (VIEWS.hasOwnProperty(value)) {
          result[value] = VIEWS[value]
        } else {
          navigate.registerView(value, value.navigate)
          result[value] = value
        }
      }, {})
    }

    if (typeof views === 'object') {
      return mapValues(views, (value, key) => {
        if (value === true) {
          return VIEWS[key]
        }

        if (!value.hasOwnProperty('title')) {
          value.title = () => key
        }

        navigate.registerView(key, value.navigate)

        return value
      })
    }

    return VIEWS
  };

  _onScroll = (event) => {
    this.calendars.forEach((calendarRef) => {
      if (calendarRef !== null && calendarRef !== event.target && calendarRef.scrollTop !== event.target.scrollTop) {
        calendarRef.scrollTop = event.target.scrollTop
      }
    })
    event.stopPropagation()
  }

  render () {
    let {
      toolbar,
      style,
      className,
      components = {},
      rtl,
      layoutStrategies
    } = this.props

    const views = this.getViews()

    let CalendarToolbar = components.toolbar || Toolbar
    return (
      <Provider store={this.store}>
        <CalendarContainer isRtl={rtl} className={className} style={style}>
          {
            (this.props.moveToolbarToRef)
              ? createPortal(
                <CalendarToolbar
                  moveToolbarToRef={this.props.moveToolbarToRef}
                  labelGenerators={Object.keys(views).reduce((result, view) => {
                    result[view] = views[view].title
                    return result
                  }, {})}
                />, this.props.moveToolbarToRef)
              : (toolbar &&
              <CalendarToolbar
                labelGenerators={Object.keys(views).reduce((result, view) => {
                  result[view] = views[view].title
                  return result
                }, {})}
              />)
          }

          <div style={{
            display: 'flex',
            flex: '0 1 100%',
            overflowY: 'hidden'
          }}>
            <MainView
              views={views}
              layoutStrategies={layoutStrategies}
              components={this.state.components}
              accessors={this.state.accessors}
              onShowMore={this._showMore}
              onScroll={this._onScroll}
              scrollRefArray={this.calendars}
            />
          </div>
        </CalendarContainer>
      </Provider>
    )
  }
}

Calendar.defaultProps = {
  popup: false,
  toolbar: true,
  view: views.MONTH,
  views: [ views.MONTH, views.WEEK, views.DAY, views.AGENDA ],
  date: new Date(),
  slotDuration: 30,
  slotInterval: 2,
  drilldownView: views.DAY,
  accessors: accessors,
  mutators: mutators,
  longPressThreshold: 250,
  layoutStrategies: {
    events: layoutStrategy,
    backgroundEvents: layoutStrategy
  },
  joinedResources: [],
  backgroundEvents: [],
  businessHours: [],
  minTime: dates.startOf(new Date(), 'day'),
  maxTime: dates.endOf(new Date(), 'day')
}

Calendar.propTypes = {
  /*
   * used to interact with third party components like styled components 💅
   */
  className: PropTypes.string,
  /*
   * used to interact with third party components
   */
  style: PropTypes.object,
  /**
   * The current date value of the calendar. Determines the visible view range
   */
  date: PropTypes.instanceOf(Date),

  /**
   * The current view of the calendar.
   *
   * @default 'month'
   */
  view: PropTypes.oneOfType([ PropTypes.node, PropTypes.func, PropTypes.string ]),

  /**
   * An array of event objects to display on the calendar
   */
  events: PropTypes.any,

  /**
   * An array of resources to display on the calendar
   */
  resources: PropTypes.any,

  /**
   * Callback fired when the `date` value changes.
   *
   * @controllable date
   */
  onDateChange: PropTypes.func,

  /**
   * Callback fired when the `view` value changes.
   *
   * @controllable date
   */
  onViewChange: PropTypes.func,

  /**
   * A callback fired when a date selection is made. Only fires when `selectable` is `true`.
   *
   * ```js
   * (
   *   slotInfo: {
   *     start: Date,
   *     end: Date,
   *     slots: Array<Date>,
   *     action: "select" | "click"
   *   }
   * ) => any
   * ```
   */
  onSelectSlot: PropTypes.func,

  /**
   * Callback fired when a calendar event is selected.
   *
   * ```js
   * (event: Object, e: SyntheticEvent) => any
   * ```
   *
   * @controllable selected
   */
  onSelectEvent: PropTypes.func,

  /**
   * Callback fired when a calendar background event is selected.
   *
   * ```js
   * (event: Object, e: SyntheticEvent) => any
   * ```
   *
   * @controllable selected
   */
  onSelectBackgroundEvent: PropTypes.func,

  /**
   * Callback fired when a calendar event is clicked twice.
   *
   * ```js
   * (event: Object, e: SyntheticEvent) => void
   * ```
   */
  onDoubleClickEvent: PropTypes.func,

  /**
   * Callback fired when dragging a selection in the Time views.
   *
   * Returning `false` from the handler will prevent a selection.
   *
   * ```js
   * (range: { start: Date, end: Date }) => ?boolean
   * ```
   */
  onSelecting: PropTypes.func,

  /**
   * An array of all resource IDs to be contained in the (joined) calendar
   */
  joinedResources: PropTypes.array,

  /**
   * Callback which gets fired when the joined resources change
   */
  onChangeJoinedResources: PropTypes.func,

  /**
   * An array of built-in view names to allow the calendar to display.
   * accepts either an array of builtin view names,
   *
   * ```jsx
   * views={['month', 'day', 'agenda']}
   * ```
   * or an object hash of the view name and the component (or boolean for builtin).
   *
   * ```jsx
   * views={{
   *   month: true,
   *   week: false,
   *   myweek: WorkWeekViewComponent,
   * }}
   * ```
   *
   * Custom views can be any React component, that implements the following
   * interface:
   *
   * ```js
   * interface View {
   *   static title(date: Date, { formats: PropTypes.string[], culture: string?, ...props }): string
   *   static navigate(date: Date, action: 'PREV' | 'NEXT' | 'DATE'): Date
   * }
   * ```
   *
   * @type Calendar.Views ('month'|'week'|'work_week'|'day'|'agenda')
   * @default ['month', 'week', 'day', 'agenda']
   */
  views: PropTypes.array,

  /**
   * Functionally equivalent to `drilldownView`, but accepts a function
   * that can return a view name. It's useful for customizing the drill-down
   * actions depending on the target date and triggering view.
   *
   * Return `null` to disable drill-down actions.
   *
   * ```js
   * <Chroniq
   *   getDrilldownView={(targetDate, currentViewName, configuredViewNames) =>
   *     if (currentViewName === 'month' && configuredViewNames.includes('week'))
   *       return 'week'
   *
   *     return null;
   *   }}
   * />
   * ```
   */
  getDrilldownView: PropTypes.func,

  /**
   * Determines whether the toolbar is displayed
   */
  toolbar: PropTypes.bool,

  /**
   * Show truncated events in an overlay when you click the "+_x_ more" link.
   */
  popup: PropTypes.bool,

  /**
   * Distance in pixels, from the edges of the viewport, the "show more" overlay should be positioned.
   *
   * ```jsx
   * <Chroniq popupOffset={30}/>
   * <Chroniq popupOffset={{x: 30, y: 20}}/>
   * ```
   */
  popupOffset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
  ]),

  /**
   * Allows mouse selection of ranges of dates/times.
   *
   * The 'ignoreEvents' option prevents selection code from running when a
   * drag begins over an event. Useful when you want custom event click or drag
   * logic
   */
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),

  /**
   * Specifies the number of miliseconds the user must press and hold on the screen for a touch
   * to be considered a "long press." Long presses are used for time slot selection on touch
   * devices.
   *
   * @type {number}
   * @default 250
   */
  longPressThreshold: PropTypes.number,

  /**
   * Determines the selectable time increments in week and day views
   */
  slotDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),

  /**
   * The number of slots per "section" in the time grid views. Adjust with `slotDuration`
   * to change the default of 1 hour long groups, with 30 minute slots.
   */
  slotInterval: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),

  /**
   *Switch the calendar to a `right-to-left` read direction.
   */
  rtl: PropTypes.bool,

  /**
   * Constrains the minimum _time_ of the Day and Week views.
   */
  minTime: PropTypes.instanceOf(Date),

  /**
   * Constrains the maximum _time_ of the Day and Week views.
   */
  maxTime: PropTypes.instanceOf(Date),

  /**
   * Determines how far down the scroll pane is initially scrolled down.
   */
  scrollTime: PropTypes.instanceOf(Date),

  /**
   * Specify a specific culture code for the Calendar.
   *
   * **Note: it's generally better to handle this globally via your i18n library.**
   */
  culture: PropTypes.string,

  /**
   * Localizer specific formats, tell the Calendar how to format and display dates.
   *
   * `format` types are dependent on the configured localizer;
   * accept strings of tokens according to their own specification, such as: `'DD mm yyyy'`.
   *
   * ```jsx
   * let formats = {
   *   dateFormat: 'dd',
   *
   *   dayFormat: (date, culture, localizer) =>
   *     localizer.format(date, 'DDD', culture),
   *
   *   dayRangeHeaderFormat: ({ start, end }, culture, local) =>
   *     local.format(start, { date: 'short' }, culture) + ' — ' +
   *     local.format(end, { date: 'short' }, culture)
   * }
   *
   * <Calendar formats={formats} />
   * ```
   *
   * All localizers accept a function of
   * the form `(date: Date, culture: ?string, localizer: Localizer) -> string`
   */
  formats: PropTypes.shape({
    /**
     * Format for the day of the month heading in the Month view.
     * e.g. "01", "02", "03", etc
     */
    dateFormat: PropTypes.string,

    /**
     * A day of the week format for Week and Day headings,
     * e.g. "Wed 01/04"
     *
     */
    dayFormat: PropTypes.string,

    /**
     * Week day name format for the Month week day headings,
     * e.g: "Sun", "Mon", "Tue", etc
     *
     */
    weekdayFormat: PropTypes.string,

    /**
     * The timestamp cell formats in Week and Time views, e.g. "4:00 AM"
     */
    timeGutterFormat: PropTypes.string,

    /**
     * Toolbar header format for the Month view, e.g "2015 April"
     *
     */
    monthHeaderFormat: PropTypes.string,

    /**
     * Toolbar header format for the Week views, e.g. "Mar 29 - Apr 04"
     */
    dayRangeHeaderFormat: PropTypes.func,

    /**
     * Toolbar header format for the Day view, e.g. "Wednesday Apr 01"
     */
    dayHeaderFormat: PropTypes.string,

    /**
     * Toolbar header format for the Agenda view, e.g. "4/1/2015 — 5/1/2015"
     */
    agendaHeaderFormat: PropTypes.string,

    /**
     * A time range format for selecting time slots, e.g "8:00am — 2:00pm"
     */
    selectRangeFormat: PropTypes.func,

    agendaDateFormat: PropTypes.string,
    agendaTimeFormat: PropTypes.string,
    agendaTimeRangeFormat: PropTypes.func,

    /**
     * Time range displayed on events.
     */
    eventTimeRangeFormat: PropTypes.func,

    /**
     * An optional event time range for events that continue onto another day
     */
    eventTimeRangeStartFormat: PropTypes.func,

    /**
     * An optional event time range for events that continue from another day
     */
    eventTimeRangeEndFormat: PropTypes.func

  }),

  /**
   * Customize how different sections of the calendar render by providing custom Components.
   * In particular the `Event` component can be specified for the entire calendar, or you can
   * provide an individual component for each view type.
   *
   * ```jsx
   * let components = {
   *   event: MyEvent, // used by each view (Month, Day, Week)
   *   toolbar: MyToolbar,
   *   agenda: {
   *      event: MyAgendaEvent // with the agenda view use a different component to render events
   *   }
   * }
   * <Calendar components={components} />
   * ```
   */
  components: PropTypes.shape({
    className: PropTypes.className,
    style: PropTypes.style,
    event: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    eventOverlay: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    eventWrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    dayWrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    dateCellWrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    toolbar: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),

    agenda: PropTypes.shape({
      date: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      time: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      event: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ])
    }),

    day: PropTypes.shape({
      header: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      event: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      eventOverlay: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ])
    }),

    week: PropTypes.shape({
      header: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      event: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      eventOverlay: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ])
    }),

    month: PropTypes.shape({
      header: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      dateHeader: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ]),
      event: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ])
    })
  }),

  /**
   * String messages used throughout the component, override to provide localizations
   */
  messages: PropTypes.shape({
    allDay: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    previous: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    next: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    today: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    month: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    week: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    day: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    agenda: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    date: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    time: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    event: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    showMore: PropTypes.func
  }),

  layoutStrategies: PropTypes.object.isRequired
}

export default DragDropContext(HTML5Backend)(Calendar)
