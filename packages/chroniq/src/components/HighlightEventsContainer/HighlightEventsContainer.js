import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import HighlightEvent from '../HighlightEvent/HighlightEvent'

import dates from '../../utils/dates'

import { get, length } from '@chroniq/chroniq-accessor-helpers'

import getStyledEvents from '../../utils/dayViewLayout'

import { connect } from '../../store/connect'
import { compose } from '../../utils/helpers'

import { makeGetHighlightEventsForResourcesAndRange } from '../../selectors/highlightEvents'

import SmartComponent from '@incoqnito.io/smart-component'

const checkFlatEquality = (a, b) => Object.keys(a).reduce((result, key) => a[key] === b[key] ? result : false, true)

class EventContainer extends React.Component {
  render () {
    return (
      <div className='chrnq-highlight-event-container'>
        { this.renderHighlightEvents() }
      </div>
    )
  }

  renderHighlightEvents = () => {
    let {
      minTime,
      maxTime,
      resources,
      slotDuration,
      slotInterval
    } = this.props

    const {
      highlightEvents
    } = this.props.redux

    const style = {
      width: 100,
      xOffset: 0
    }

    const styledEvents = getStyledEvents(highlightEvents, {
      accessors: {
        id: 'id',
        start: 'from',
        end: 'to'
      },
      minTime,
      maxTime,
      slotDuration,
      slotInterval,
      layoutStrategy: (events, { getId }) => events.reduce((result, event) => {
        result[getId(event)] = style

        return result
      }, {})
    })

    return styledEvents.map(({ event, style: yStyle }) => {
      let resourceId = event.resourceId
      let eventId = event.id
      let style = {
        height: yStyle.height + '%',
        left: `${yStyle.xOffset}%`,
        width: `${yStyle.width}%`,
        top: yStyle.top + '%'
      }
      let key = typeof eventId !== 'undefined' ? `bg-${eventId}` : `bg-${resourceId}${yStyle.height}${style.top}`

      return (
        <HighlightEvent
          key={key}
          style={style}
        />
      )
    })
  }
}

EventContainer.propTypes = {
  redux: PropTypes.shape({
    highlightEvents: PropTypes.array.isRequired
  }).isRequired,
  resources: PropTypes.any,
  accessors: PropTypes.object.isRequired,
  slotDuration: PropTypes.number.isRequired,
  slotInterval: PropTypes.number.isRequired,
  minTime: PropTypes.instanceOf(Date).isRequired,
  maxTime: PropTypes.instanceOf(Date).isRequired,
  rtl: PropTypes.bool,
  layoutStrategies: PropTypes.object.isRequired
}

const makeMapStateToProps = () => {
  const getHighlightEventsForResourcesAndRange = makeGetHighlightEventsForResourcesAndRange()

  const mapStateToProps = (state, props) => ({
    redux: {
      highlightEvents: getHighlightEventsForResourcesAndRange(state, props.resources, {
        ...props.accessors,
        highlightEvent: {
          start: 'from',
          end: 'to',
          resourceId: 'resourceId'
        }
      }, [
        props.date
      ])
    }
  })

  return mapStateToProps
}

export default compose(
  connect(makeMapStateToProps, null, null, {
    areStatesEqual: (a, b) => a === b
  }),
  SmartComponent({
    'minTime': (a, b) => a.getTime() === b.getTime(),
    'maxTime': (a, b) => a.getTime() === b.getTime(),
    'redux': {
      'highlightEvents': (a, b, props) => {
        if (length(a) !== length(b)) {
          return false
        }

        return a.reduce((result, event) => {
          const otherEvent = b.find((bEvent) => bEvent.id === event.id)
          if (!otherEvent) {
            return false
          }

          if (otherEvent === event || (
            otherEvent.from.getTime() === event.from.getTime() &&
            otherEvent.to.getTime() === event.to.getTime() &&
            otherEvent.resourceId === event.resourceId
          )) {
            return result
          }

          return false
        }, true)
      }
    },
    'resources': checkFlatEquality
  })
)(EventContainer)
