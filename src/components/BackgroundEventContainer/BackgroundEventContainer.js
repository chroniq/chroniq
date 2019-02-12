import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import BackgroundEvent from '../BackgroundEvent/BackgroundEvent'

import { get, length } from '../../accessors'

import getStyledEvents from '../../utils/dayViewLayout'

import { connect } from '../../store/connect'
import { compose } from '../../utils/helpers'

import { makeGetBackgroundEventsForResourcesAndRange } from '../../selectors/backgroundEvents'
import { onSelectBackgroundEvent } from '../../store/actions'

import SmartComponent from '@incoqnito.io/smart-component'

import { createPortal } from 'react-dom'
import BackgroundEventPopup from '../BackgroundEventPopup/BackgroundEventPopup'

const checkFlatEquality = (a, b) => Object.keys(a).reduce((result, key) => a[key] === b[key] ? result : false, true)

class EventComtainer extends React.Component {
  constructor (props) {
    super(props)

    this.backgroundEventDiv = null
  }

  state = {
    backgroundEventCoordinates: false,
    mouseOver: false,
    showPopup: false,
    enableBackgroundEventPopup: (this.props.redux.enableBackgroundEventPopup) ? true : false
  }

  // Getting size of BackgroundEvent element, sending it and draw
  onMouseEnter = () => {
    if (this.state.enableBackgroundEventPopup) {
      this.setState({
        backgroundEventCoordinates: this.backgroundEventDiv.getBoundingClientRect(),
        timeContentCoordinates: this.props.timeContentRef.getBoundingClientRect(),
        mouseOver: true
      })
    }
  }
  // Switch off Event Tooltip when mouse poing left the Event component
  onMouseLeave = () => {
    if (this.state.enableBackgroundEventPopup) {
      this.setState({
        mouseOver: false
      })
    }
  }

  render () {
    return (
      <div className='chrnq-background-event-container'>
        { this.renderBackgroundEvents() }
      </div>
    )
  }

  renderBackgroundEvents = () => {
    let {
      date,
      minTime,
      maxTime,
      resources,
      rtl,
      slotDuration,
      slotInterval,
      layoutStrategies: {
        backgroundEvents: layoutStrategy
      },
      components: {
        backgroundEvent: backgroundEventComponent,
        backgroundEventPopupView: BackgroundEventPopupView
      },
      accessors,
      backgroundEventPopupDirection,
      timeContentRef
    } = this.props

    const {
      backgroundEvents,
      onSelectBackgroundEvent
    } = this.props.redux

    let styledEvents = getStyledEvents(backgroundEvents, {
      accessors: accessors.backgroundEvent,
      minTime,
      maxTime,
      slotDuration,
      slotInterval,
      layoutStrategy
    })

    return styledEvents.map(({ event, style: yStyle }) => {
      let resourceId = get(event, accessors.backgroundEvent.resourceId)
      let eventId = get(event, accessors.backgroundEvent.id)
      let style = {
        height: yStyle.height + '%',
        [rtl ? 'right' : 'left']: `${Math.max(0, yStyle.xOffset)}%`,
        width: `${yStyle.width}%`,
        top: yStyle.top + '%'
      }
      let key = typeof eventId !== 'undefined' ? `bg-${eventId}` : `bg-${resourceId}${yStyle.height}${style.top}`

      let onClick = (e) => onSelectBackgroundEvent(event, accessors.backgroundEvent)

      const enableBackgroundEventPopup = this.state.enableBackgroundEventPopup
      return (
        <Fragment key={key}>
          {
            (enableBackgroundEventPopup && this.state.mouseOver) && createPortal(
              <BackgroundEventPopup
                event={event}
                direction={backgroundEventPopupDirection}
                backgroundEventCoordinates={this.state.backgroundEventCoordinates}
                timeContentCoordinates={this.state.timeContentCoordinates}
                backgroundEventPopupView={BackgroundEventPopupView} />,
              timeContentRef
            )
          }
          <BackgroundEvent
            style={style}
            accessors={accessors}
            event={event}
            date={date}
            resources={resources}
            backgroundEventComponent={backgroundEventComponent}
          />
          <div
            className='chrnq-background-event-clickable'
            onClick={onClick}
            style={style}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            ref={(el) => this.backgroundEventDiv = el} />
        </Fragment>
      )
    })
  }
}

EventComtainer.propTypes = {
  redux: PropTypes.shape({
    backgroundEvents: PropTypes.array.isRequired
  }).isRequired,
  date: PropTypes.any,
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
  const getBackgroundEventsForResourcesAndRange = makeGetBackgroundEventsForResourcesAndRange()

  const mapStateToProps = (state, props) => {
    let { resources, accessors, date } = props
    let range = [ date ]
    const reduxState = state.toJS().props
    return {
      backgroundEvents: getBackgroundEventsForResourcesAndRange(state, resources, accessors, range),
      enableBackgroundEventPopup: reduxState.enableBackgroundEventPopup,
      backgroundEventPopupDirection: reduxState.backgroundEventPopupDirection
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = {
  onSelectBackgroundEvent
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
      'backgroundEvents': (a, b, props) => {
        if (length(a) !== length(b)) {
          return false
        }

        return a.reduce((result, event) => {
          const otherEvent = b.find((bEvent) => get(bEvent, props.accessors.backgroundEvent.id) === get(event, props.accessors.backgroundEvent.id))
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
)(EventComtainer)
