import PropTypes from 'prop-types'
import React from 'react'

import Event from '../Event/Event'

import dates from '../../utils/dates'
import localizer from '../../localizer'

import { get, length } from '@chroniq/chroniq-accessor-helpers'

import getStyledEvents, { startsBefore } from '../../utils/dayViewLayout'

import { connect } from '../../store/connect'
import { compose } from '../../utils/helpers'

import { makeGetEventsForResourcesAndRange } from '../../selectors/events'
import { onSelectEvent, onDoubleClickEvent } from '../../store/actions'

import SmartComponent from '@incoqnito.io/smart-component'

function startsAfter (date, maxTime) {
  return dates.gt(dates.merge(maxTime, date), maxTime, 'minutes')
}

const checkFlatEquality = (a, b) => Object.keys(a).reduce((result, key) => a[key] === b[key] ? result : false, true)

class EventContainer extends React.Component {
  render () {
    return (
      <div className='chrnq-event-container'>
        { this.renderEvents() }
      </div>
    )
  }

  renderEvents = () => {
    let {
      minTime,
      maxTime,
      date,
      resources,
      culture,
      messages,
      rtl,
      slotDuration,
      slotInterval,
      layoutStrategies: {
        events: layoutStrategy
      },
      components: {
        event: EventComponent,
        eventOverlay: EventOverlayComponent,
        eventWrapper: EventWrapper,
        eventPopupView: EventPopupView
      },
      eventTimeRangeFormat,
      eventTimeRangeStartFormat,
      eventTimeRangeEndFormat,
      accessors,
      timeContentRef
    } = this.props

    let {
      onSelectEvent,
      onDoubleClickEvent
    } = this.props.redux

    const events = this.props.redux.events
      .filter((event) => !get(event, accessors.event['allDay']))

    let styledEvents = getStyledEvents(events, {
      accessors: accessors.event,
      minTime,
      maxTime,
      slotDuration,
      slotInterval,
      layoutStrategy
    })

    const colors = resources.reduce((result, resource) => {
      let resourceId = get(resource, accessors.resource.id)
      let resourceColor = get(resource, accessors.resource.color)
      result[resourceId] = resourceColor
      return result
    }, {})

    return styledEvents.map(({ event, style: yStyle }, idx) => {
      let _eventTimeRangeFormat = eventTimeRangeFormat
      let _continuesPrior = false
      let _continuesAfter = false
      let start = get(event, accessors.event.start)
      let end = get(event, accessors.event.end)

      if (start < minTime) {
        start = minTime
        _continuesPrior = true
        _eventTimeRangeFormat = eventTimeRangeEndFormat
      }

      if (end > maxTime) {
        end = maxTime
        _continuesAfter = true
        _eventTimeRangeFormat = eventTimeRangeStartFormat
      }

      let continuesPrior = startsBefore(start, minTime)
      let continuesAfter = startsAfter(end, maxTime)

      let title = get(event, accessors.event.title)
      let label
      if (_continuesPrior && _continuesAfter) {
        label = messages.allDay
      } else {
        label = localizer.format({ start, end }, _eventTimeRangeFormat, culture)
      }


      let resourceId = get(event, accessors.event.resourceId)
      let eventColor = get(event, accessors.event.color)
      let color = eventColor || colors[resourceId]
      let key = 'evt_' + idx
      let { height, top, width, xOffset, zIndex } = yStyle

      let style = {
        top: `${top}%`,
        height: `${height}%`,
        [rtl ? 'right' : 'left']: `${Math.max(0, xOffset)}%`,
        width: `${width}%`,
        zIndex: zIndex
      }

      let onClick = (e) => this.props.redux.onSelectEvent(event, accessors.event, e)
      let onDoubleClick = (e) => this.props.redux.onDoubleClickEvent(event, accessors.event, e)

      return <Event
        key={key}
        style={style}
        date={date}
        event={event}
        title={title}
        label={label}
        color={color}
        accessors={accessors}
        startsEarlier={continuesPrior}
        continuesAfer={continuesAfter}
        startsPriorDay={_continuesPrior}
        continuesNextDay={_continuesAfter}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        eventWrapperComponent={EventWrapper}
        eventComponent={EventComponent}
        eventOverlayComponent={EventOverlayComponent}
        eventPopupView={EventPopupView}
        timeContentRef={timeContentRef}
      />
    })
  };
}

EventContainer.propTypes = {
  redux: PropTypes.shape({
    events: PropTypes.any.isRequired,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func
  }).isRequired,
  resources: PropTypes.any,
  date: PropTypes.instanceOf(Date).isRequired,
  accessors: PropTypes.object.isRequired,
  slotDuration: PropTypes.number.isRequired,
  slotInterval: PropTypes.number.isRequired,
  minTime: PropTypes.instanceOf(Date).isRequired,
  maxTime: PropTypes.instanceOf(Date).isRequired,
  culture: PropTypes.string,
  messages: PropTypes.object,
  rtl: PropTypes.bool,
  eventTimeRangeFormat: PropTypes.func,
  eventTimeRangeStartFormat: PropTypes.func,
  eventTimeRangeEndFormat: PropTypes.func,
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
  layoutStrategies: PropTypes.object.isRequired
}

const makeMapStateToProps = () => {
  const getEventsForResourcesAndRange = makeGetEventsForResourcesAndRange()
  const mapStateToProps = (state, props) => {
    let { resources, accessors, date } = props
    let range = [ date ]

    return {
      events: getEventsForResourcesAndRange(state,
        resources,
        accessors,
        range
      )
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = {
  onSelectEvent,
  onDoubleClickEvent
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps, mergeProps),
  SmartComponent({
    'redux': {
      'events': (a, b, props) => {

        if (length(a) !== length(b)) {
          return false
        }

        return a.reduce((result, event) => {
          const otherEvent = b.find((bEvent) => get(bEvent, props.accessors.event.id) === get(event, props.accessors.event.id))
          if (!otherEvent) {
            return false
          }

          if (otherEvent === event) {
            return result
          }

          return false
        }, true)
      }
    },
    'resources': checkFlatEquality
  })
)(EventContainer)
