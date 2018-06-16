import React from 'react'
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
import { get } from '@chroniq/chroniq-accessor-helpers'

import SmartComponent from '@incoqnito.io/smart-component'

import Resizer from './Resizer.js'

class Event extends React.Component {
  state = {
    isDragging: false,
    dragStart: false
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

  render () {
    const {
      className: passedClassName,
      connectDragSource,
      date,
      event,
      title,
      label,
      color,
      onClick,
      onDoubleClick,
      eventWrapperComponent: EventWrapper,
      eventComponent: Event,
      eventOverlayComponent: EventOverlay,
      style,
      startsEarlier,
      continuesAfter,
      startsPriorDay,
      continuesNextDay,
      accessors
    } = this.props

    const { isSelected, isDeactivated } = this.props.redux
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

    return (
      <EventWrapper event={event}>
        {
          connectDragSource(
            <div
              style={style}
              title={typeof label === 'string' ? label : ''}
              onClick={onClick}
              onDoubleClick={onDoubleClick}
              className={className}
            >
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
    return {
      redux: {
        isSelected: isSelected(state, accessors, event),
        isDeactivated: isDeactivated(state, accessors, event)
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
