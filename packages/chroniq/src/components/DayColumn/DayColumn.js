import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'

import dates from '../../utils/dates'
import { get, length } from '@chroniq/chroniq-accessor-helpers'

import { DropTarget } from 'react-dnd'

import TimeColumn from '../TimeColumn/TimeColumn'
import EventContainer from '../EventContainer/EventContainer'
import BackgroundEventContainer from '../BackgroundEventContainer/BackgroundEventContainer'
import HighlightEventsContainer from '../HighlightEventsContainer/HighlightEventsContainer.js'
import BusinessHourContainer from '../BusinessHourContainer/BusinessHourContainer'

import { connect } from '../../store/connect'
import { classNames, compose } from '../../utils/helpers'

import {
  getSlotDuration, makeGetMinTime, makeGetMaxTime,
  getMessages, getCulture, getRtl, getSlotInterval,
  getEventTimeRangeFormat, getEventTimeRangeStartFormat,
  getEventTimeRangeEndFormat, getSnapDuration
} from '../../store/selectors'
import { makeCanDrop } from '../../selectors/highlightEvents'

import {
  onSelectEvent, onDoubleClickEvent, onSelectBackgroundEvent, onEventDrag,
  onEventResizing, setDragItemOverCalendar
} from '../../store/actions'

import SmartComponent from '@incoqnito.io/smart-component'

const checkFlatEquality = (a, b) => Object.keys(a).reduce((result, key) => a[key] === b[key] ? result : false, true)

class DayColumn extends React.Component {
  componentDidMount () {
    this.domNode = findDOMNode(this)
  }

  componentDidUpdate (prevProps) {
    const isOver = this.props.isOver
    if (prevProps.isOver !== isOver) {
      if (isOver) {
        this.props.redux.setDragItemOverCalendar(true)
      } else {
        window.setTimeout(() => this.props.redux.setDragItemOverCalendar(false), 50) // delay leave so the other enter always applies first (when dragging onto another DayColumn)
      }
    }
  }

  componentWillUnmount () {
    this.domNode = null
  }

  getBoundingClientRect () {
    return this.domNode && this.domNode.getBoundingClientRect()
  }

  render () {
    const {
      className: passedClassName,
      connectDropTarget,
      now,
      date,
      accessors,
      resources,
      components,
      layoutStrategies
    } = this.props

    const {
      minTime,
      maxTime,
      culture,
      messages,
      rtl,
      slotDuration,
      slotInterval,
      onSelectEvent,
      formats: {
        eventTimeRangeFormat,
        eventTimeRangeStartFormat,
        eventTimeRangeEndFormat
      },
      onDoubleClickEvent
    } = this.props.redux

    let className = classNames(passedClassName, 'chrnq-day-slot', dates.isToday(maxTime) && 'chrnq-today')

    return connectDropTarget(
      <div style={{
        display: 'flex',
        flex: '1 0 0px',
        zIndex: 0
      }}>
        <TimeColumn
          className={className}
          now={now}
          date={date}
          resources={resources}
          accessors={accessors}
          minTime={minTime}
          maxTime={maxTime}
          culture={culture}
          messages={messages}
          rtl={rtl}
          slotDuration={slotDuration}
          slotInterval={slotInterval}
          onSelectEvent={onSelectEvent}
          onDoubleClickEvent={onDoubleClickEvent}
          layoutStrategies={layoutStrategies}
          components={components}
          eventTimeRangeFormat={eventTimeRangeFormat}
          eventTimeRangeStartFormat={eventTimeRangeStartFormat}
          eventTimeRangeEndFormat={eventTimeRangeEndFormat}
        >
          <BusinessHourContainer
            date={date}
            minTime={minTime}
            maxTime={maxTime}
            accessors={accessors}
            resources={resources}
            culture={culture}
            messages={messages}
            rtl={rtl}
            slotDuration={slotDuration}
            slotInterval={slotInterval}
            onSelectEvent={onSelectEvent}
            onDoubleClickEvent={onDoubleClickEvent}
            layoutStrategies={layoutStrategies}
            components={components}
          />

          <EventContainer
            date={date}
            minTime={minTime}
            maxTime={maxTime}
            resources={resources}
            culture={culture}
            messages={messages}
            rtl={rtl}
            slotDuration={slotDuration}
            slotInterval={slotInterval}
            onSelectEvent={onSelectEvent}
            onDoubleClickEvent={onDoubleClickEvent}
            layoutStrategies={layoutStrategies}
            components={components}
            eventTimeRangeFormat={eventTimeRangeFormat}
            eventTimeRangeStartFormat={eventTimeRangeStartFormat}
            eventTimeRangeEndFormat={eventTimeRangeEndFormat}
            accessors={accessors}
          />

          <BackgroundEventContainer
            date={date}
            minTime={minTime}
            maxTime={maxTime}
            resources={resources}
            culture={culture}
            messages={messages}
            rtl={rtl}
            slotDuration={slotDuration}
            slotInterval={slotInterval}
            onSelectEvent={onSelectEvent}
            onDoubleClickEvent={onDoubleClickEvent}
            layoutStrategies={layoutStrategies}
            components={components}
            eventTimeRangeFormat={eventTimeRangeFormat}
            eventTimeRangeStartFormat={eventTimeRangeStartFormat}
            eventTimeRangeEndFormat={eventTimeRangeEndFormat}
            accessors={accessors}
          />

          <HighlightEventsContainer
            date={date}
            minTime={minTime}
            maxTime={maxTime}
            resources={resources}
            culture={culture}
            messages={messages}
            rtl={rtl}
            slotDuration={slotDuration}
            slotInterval={slotInterval}
            onSelectEvent={onSelectEvent}
            onDoubleClickEvent={onDoubleClickEvent}
            layoutStrategies={layoutStrategies}
            components={components}
            eventTimeRangeFormat={eventTimeRangeFormat}
            eventTimeRangeStartFormat={eventTimeRangeStartFormat}
            eventTimeRangeEndFormat={eventTimeRangeEndFormat}
            accessors={accessors}
          />
        </TimeColumn>
      </div>
    )
  }
}

DayColumn.propTypes = {
  className: PropTypes.string,
  resources: PropTypes.any,
  date: PropTypes.instanceOf(Date).isRequired,
  now: PropTypes.instanceOf(Date).isRequired,
  accessors: PropTypes.object.isRequired,
  layoutStrategies: PropTypes.object.isRequired,
  components: PropTypes.shape({
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
    ]).isRequired,
    dayWrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }).isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  redux: PropTypes.shape({
    slotDuration: PropTypes.number.isRequired,
    slotInterval: PropTypes.number.isRequired,
    minTime: PropTypes.instanceOf(Date).isRequired,
    maxTime: PropTypes.instanceOf(Date).isRequired,
    culture: PropTypes.string,
    messages: PropTypes.object,
    formats: PropTypes.object,
    rtl: PropTypes.bool,
    onSelectBackgroundEvent: PropTypes.func.isRequired,
    onDoubleClickEvent: PropTypes.func.isRequired,
    onSelectEvent: PropTypes.func.isRequired,
    setDragItemOverCalendar: PropTypes.func.isRequired
  }).isRequired
}

const makeMapStateToProps = () => {
  const getMinTime = makeGetMinTime()
  const getMaxTime = makeGetMaxTime()

  const canDrop = makeCanDrop()

  const mapStateToProps = (state, props) => ({
    slotDuration: getSlotDuration(state),
    slotInterval: getSlotInterval(state),
    minTime: getMinTime(state, props.date),
    maxTime: getMaxTime(state, props.date),
    culture: getCulture(state),
    messages: getMessages(state),
    rtl: getRtl(state),
    canDrop: canDrop(state, props.resources, props.accessors),
    formats: {
      eventTimeRangeFormat: getEventTimeRangeFormat(state),
      eventTimeRangeStartFormat: getEventTimeRangeStartFormat(state),
      eventTimeRangeEndFormat: getEventTimeRangeEndFormat(state)
    },
    snapDuration: getSnapDuration(state)
  })

  return mapStateToProps
}

const mapDispatchToProps = {
  onSelectEvent,
  onDoubleClickEvent,
  onSelectBackgroundEvent,
  onEventDrag,
  onEventResizing,
  setDragItemOverCalendar
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

const calcHoveredTime = (monitor, component, { minTime, maxTime, snapDuration }) => {
  const clientOffset = monitor.getClientOffset()
  const initialClientOffset = monitor.getInitialClientOffset()
  const initialSourceClientOffset = monitor.getInitialSourceClientOffset()
  const mouseOffset = {
    x: initialClientOffset.x - initialSourceClientOffset.x,
    y: initialClientOffset.y - initialSourceClientOffset.y
  }
  const currentOffset = {
    x: clientOffset.x - mouseOffset.x,
    y: clientOffset.y - mouseOffset.y
  }

  const componentRect = component.getBoundingClientRect()

  const absoluteY = currentOffset.y - componentRect.y
  const relativeY = absoluteY / componentRect.height

  const minutesThisDay = dates.diff(minTime, maxTime, 'minutes', true)
  const hoveredMinutes = minutesThisDay * relativeY

  return dates.add(minTime, hoveredMinutes - (hoveredMinutes % snapDuration) + snapDuration, 'minutes')
}

const dropTargetSpec = {
  drop ({ redux: { minTime, maxTime, snapDuration }, accessors, resources }, monitor, component) {
    const event = monitor.getItem()
    const currentlyHoveredTime = calcHoveredTime(monitor, component, { minTime, maxTime, snapDuration })

    if (monitor.getItemType() === 'drag') {
      const eventStartEndDiff = dates.diff(
        get(event, accessors.event.start),
        get(event, accessors.event.end),
        'minutes',
        true
      )

      return {
        start: currentlyHoveredTime,
        end: dates.add(currentlyHoveredTime, eventStartEndDiff, 'minutes'),
        resourceId: length(resources) === 1
          ? get(resources[0], accessors.resource.id)
          : 'multiple'
      }
    } else {
      return {
        start: get(event, accessors.event.start),
        end: currentlyHoveredTime
      }
    }
  },

  hover ({ redux: { minTime, maxTime, snapDuration, onEventDrag, onEventResizing }, accessors, resources }, monitor, component) {
    if (!monitor.canDrop()) {
      return
    }

    const event = monitor.getItem()
    const currentlyHoveredTime = calcHoveredTime(monitor, component, { minTime, maxTime, snapDuration })

    if (monitor.getItemType() === 'drag') {
      const eventStartEndDiff = dates.diff(
        get(event, accessors.event.start),
        get(event, accessors.event.end),
        'minutes',
        true
      )

      onEventDrag({
        start: currentlyHoveredTime,
        end: dates.add(currentlyHoveredTime, eventStartEndDiff, 'minutes'),
        resourceId: length(resources) === 1
          ? get(resources[0], accessors.resource.id)
          : 'multiple'
      })
    } else {
      if (!dates.lt(get(event, accessors.event.start), currentlyHoveredTime)) {
        return
      }

      onEventResizing({
        start: get(event, accessors.event.start),
        end: currentlyHoveredTime
      })
    }
  },

  canDrop ({ isLegend, redux: { canDrop }, accessors, resources }, monitor) {
    if (isLegend) {
      return false
    }

    if (monitor.getItemType() === 'resize') {
      const event = monitor.getItem()
      if (!resources.some((resource) => get(resource, accessors.resource.id) === event.resourceId)) {
        return false
      }

      return true
    }

    return canDrop
  }
}

const dropTargetCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
})

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps, mergeProps, {
    areStatesEqual: (a, b) => a === b
  }),
  DropTarget(
    [ 'drag', 'resize' ],
    dropTargetSpec,
    dropTargetCollect
  ),
  SmartComponent({
    'date': (a, b) => a.getTime() === b.getTime(),
    'style': checkFlatEquality,
    'resources': checkFlatEquality,
    'redux': {
      'minTime': (a, b) => a.getTime() === b.getTime(),
      'maxTime': (a, b) => a.getTime() === b.getTime(),
      'canDrop': (a, b) => true,
      'formats': checkFlatEquality
    }
  })
)(DayColumn)
