import React from 'react'
import { createPortal } from 'react-dom'

import PropTypes from 'prop-types'

import { DragSource } from 'react-dnd'

import {
  getDarkenColor,
  getReadableColor
} from '../../utils/colors'

import { connect } from '../../store/connect'
import {
  makeIsSelected,
  makeIsDeactivated
} from '../../store/selectors'
import {
  onEventDragBegin,
  onEventDrop
} from '../../store/actions'

import {
  classNames,
  compose
} from '../../utils/helpers'
import { get } from '../../accessors'

import SmartComponent from '@incoqnito.io/smart-component'

import Resizer from './Resizer.js'
import EventPopup from '../EventPopup/EventPopup'

class Event extends React.Component {
  constructor (props) {
    super(props)

    this.eventDiv = null
  }

  state = {
    isDragging: false,
    dragStart: false,
    eventCoordinates: false,
    mouseOver: false,
    showPopup: false,
    hoverOnEventPopup: !!(this.props.redux.hoverOnEventPopup),
    enableEventPopup: !!(this.props.redux.enableEventPopup)
  }

  onBeginDrag = () => {
    this.setState({
      isDragging: true,
      dragStart: true
    }, () => window.setTimeout(() => this.setState({ dragStart: false }), 1))
  }

  onEndDrag = () => {
    this.setState({
      isDragging: false
    })
  }
  // Getting size of Event element, sending it to EventArrow and draw
  onMouseEnter = (id) => {
    if (this.state.hoverOnEventPopup) {
      this.setState({
        eventCoordinates: this.eventDiv.getBoundingClientRect(),
        timeContentCoordinates: this.props.timeContentRef.getBoundingClientRect(),
        mouseOver: true
      })
    }
  }
  // Switch off Event Tooltip when mouse poing left the Event component
  onMouseLeave = (id) => {
    if (this.state.hoverOnEventPopup) {
      this.setState({
        mouseOver: false
      })
    }
  }

  // Show popup onClick
  onClickPopupShowing = (e) => {
    this.props.onClick(e)
    if (this.state.enableEventPopup) {
      this.setState({
        eventCoordinates: this.eventDiv.getBoundingClientRect(),
        timeContentCoordinates: this.props.timeContentRef.getBoundingClientRect(),
        showPopup: !this.state.showPopup
      })
    }
  }

  render () {
    const {
      className: passedClassName,
      connectDragSource,
      date,
      event,
      title,
      label,
      color,
      onDoubleClick,
      eventWrapperComponent: EventWrapper,
      eventComponent: Event,
      eventOverlayComponent: EventOverlay,
      eventPopupView: EventPopupView,
      style,
      startsEarlier,
      continuesAfter,
      startsPriorDay,
      continuesNextDay,
      accessors,
      timeContentRef
    } = this.props
    const {
      isSelected,
      isDeactivated,
      eventPopupDirection
    } = this.props.redux
    const { isDragging, dragStart } = this.state
    const className = classNames(passedClassName, 'chrnq-event', {
      'chrnq-selected': isSelected,
      '--is-deactivated': isDeactivated,
      'chrnq-event-continues-earlier': startsEarlier,
      'chrnq-event-continues-later': continuesAfter,
      'chrnq-event-continues-day-prior': startsPriorDay,
      'chrnq-event-continues-day-after': continuesNextDay,
      'chrnq-dnd-dragging': isDragging,
      'chrnq-dnd-drag-start': dragStart
    })

    const enableEventPopup = this.state.enableEventPopup
    const hoverOnEventPopup = this.state.hoverOnEventPopup
    return (
      <EventWrapper event={event}>
        {
          connectDragSource(
            <div
              style={style}
              title={typeof label === 'string' ? label : ''}
              onClick={this.onClickPopupShowing}
              onDoubleClick={onDoubleClick}
              className={className}
              onMouseEnter={() => this.onMouseEnter(event.id)}
              onMouseLeave={() => this.onMouseLeave(event.id)}
              ref={(el) => this.eventDiv = el}
            >
              {
                ((enableEventPopup && this.state.mouseOver && hoverOnEventPopup) || (enableEventPopup && !hoverOnEventPopup && this.state.showPopup)) && createPortal(
                  <EventPopup
                    event={event}
                    direction={eventPopupDirection}
                    eventCoordinates={this.state.eventCoordinates}
                    timeContentCoordinates={this.state.timeContentCoordinates}
                    eventPopupView={EventPopupView} />,
                  timeContentRef
                )
              }
              <div className='chrnq-event-content'>
                { Event
                  ? <Event date={date} event={event} title={title} color={color} />
                  : (
                    <div className='chrnq-day-event' style={{
                      backgroundColor: color,
                      borderColor: getDarkenColor(0.15, color),
                      color: getReadableColor(color)
                    }}>
                      <span className='chrnq-day-event-title'>{ title }</span>
                      <span className='chrnq-day-event-time'>{ label }</span>
                    </div>
                  )
                }
              </div>
              { EventOverlay
                ? (
                  <div className='chrnq-event-overlay'>
                    <EventOverlay event={event} />
                  </div>
                )
                : null
              }

              <Resizer
                event={event}
                accessors={accessors}
                onBeginDrag={this.onBeginDrag}
                onEndDrag={this.onEndDrag}
              />
            </div>
          )
        }
      </EventWrapper>
    )
  }
}

Event.propTypes = {
  redux: PropTypes.shape({
    isSelected: PropTypes.bool,
    isDeactivated: PropTypes.bool
  }).isRequired,

  className: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,

  event: PropTypes.object.isRequired,
  title: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,

  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,

  eventWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  eventComponent: PropTypes.func,
  eventOverlayComponent: PropTypes.func,
  eventPopupView: PropTypes.func,

  style: PropTypes.object.isRequired,

  startsEarlier: PropTypes.bool,
  continuesAfter: PropTypes.bool,
  startsPriorDay: PropTypes.bool,
  continuesNextDay: PropTypes.bool
}

const makeMapStateToProps = () => {
  const isSelected = makeIsSelected()
  const isDeactivated = makeIsDeactivated()

  const mapStateToProps = (state, props) => {
    let { accessors, event } = props
    const reduxState = state.toJS().props
    return {
      redux: {
        isSelected: isSelected(state, accessors, event),
        isDeactivated: isDeactivated(state, accessors, event),
        enableEventPopup: reduxState.enableEventPopup,
        eventPopupDirection: reduxState.eventPopupDirection,
        hoverOnEventPopup: reduxState.hoverOnEventPopup
      }
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = {
  onEventDragBegin,
  onEventDrop
}

const dragSourceSpec = {
  beginDrag ({ accessors, event, onEventDragBegin }, monitor, component) {
    component.onBeginDrag()

    onEventDragBegin({
      id: get(event, accessors.event.id),
      resourceId: get(event, accessors.event.resourceId),
      start: get(event, accessors.event.start),
      end: get(event, accessors.event.end),
      event
    }, accessors)

    return event
  },

  endDrag ({ onEventDrop }, monitor, component) {
    component.onEndDrag()

    const result = monitor.getDropResult()
    if (result) {
      delete result.dropEffect
    }

    return onEventDrop(result)
  }
}

const dragSourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource()
})

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  DragSource('drag', dragSourceSpec, dragSourceCollect),
  SmartComponent({
    redux: {
      isSelected: (a, b) => a === b,
      isDeactivated: (a, b) => a === b
    }
  })
)(Event)
