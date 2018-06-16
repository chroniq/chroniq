import PropTypes from 'prop-types'
import React from 'react'
import dates from '../../utils/dates'

import { DragSource } from 'react-dnd'

import { get } from '@chroniq/chroniq-accessor-helpers'
import { connect } from '../../store/connect'
import { classNames, compose } from '../../utils/helpers'

import {
  onSelectEvent,
  onDoubleClickEvent,
  onEventDragBegin,
  onEventDrop
} from '../../store/actions'

import {
  makeIsSelected,
  makeIsDeactivated
} from '../../store/selectors'

import {
  getDarkenColor,
  getReadableColor
} from '../../utils/colors'

import Resizer from './Resizer.js'

class EventCell extends React.PureComponent {
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
    let {
      connectDragSource,
      className,
      event,
      color,
      accessors,
      slotStart,
      slotEnd,
      eventComponent: Event,
      eventWrapperComponent: EventWrapper,
      style: passedStyle,
      ...props
    } = this.props

    const {
      selected,
      deactivated,
      onSelectEvent,
      onDoubleClickEvent
    } = this.props.redux

    const { isDragging, dragStart } = this.state

    let title = get(event, accessors.event.title)
    let end = get(event, accessors.event.end)
    let start = get(event, accessors.event.start)
    let isAllDay = get(event, accessors.event.allDay)
    let continuesPrior = dates.lt(start, slotStart, 'day')
    let continuesAfter = dates.gte(end, slotEnd, 'day')

    className = classNames('chrnq-event', className, {
      'chrnq-selected': selected,
      '--is-deactivated': deactivated,
      'chrnq-event-allday': isAllDay || dates.diff(start, dates.ceil(end, 'day'), 'day') > 1,
      'chrnq-event-continues-prior': continuesPrior,
      'chrnq-event-continues-after': continuesAfter,
      'chrnq-dnd-dragging': isDragging,
      'chrnq-dnd-drag-start': dragStart
    })

    let style = {
      backgroundColor: color,
      borderColor: getDarkenColor(0.15, color),
      color: getReadableColor(color)
    }

    return (
      <EventWrapper event={event}>
        {
          connectDragSource(
            <div
              style={{passedStyle}}
              className={className}
              onClick={(e) => onSelectEvent(event, accessors.event, e)}
              onDoubleClick={(e) => onDoubleClickEvent(event, accessors.event, e)}
            >
              <div className='chrnq-event-content' title={title}>
                { Event
                  ? <Event event={event} title={title} />
                  : (
                    <div className='chrnq-month-event' style={style}>
                      <span className='chrnq-month-event-title'>{ title }</span>
                    </div>
                  )
                }
              </div>

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

EventCell.propTypes = {
  redux: PropTypes.shape({
    selected: PropTypes.bool,
    onSelectEvent: PropTypes.func.isRequired,
    onDoubleClickEvent: PropTypes.func.isRequired,
    deactivated: PropTypes.bool
  }).isRequired,
  event: PropTypes.object.isRequired,
  slotStart: PropTypes.instanceOf(Date),
  slotEnd: PropTypes.instanceOf(Date),
  color: PropTypes.string,
  accessors: PropTypes.object,
  className: PropTypes.string,
  eventComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  eventWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  onDoubleClick: PropTypes.func
}

const makeMapStateToProps = () => {
  const isSelected = makeIsSelected()
  const isDeactivated = makeIsDeactivated()

  const mapStateToProps = (state, props) => {
    let { accessors, event } = props
    return {
      selected: isSelected(state, accessors, event),
      deactivated: isDeactivated(state, accessors, event)
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = {
  onSelectEvent,
  onDoubleClickEvent,
  onEventDragBegin,
  onEventDrop
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

const dragSourceSpec = {
  beginDrag ({ accessors, event, redux: { onEventDragBegin } }, monitor, component) {
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

  endDrag ({ redux: { onEventDrop } }, monitor, component) {
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
  connect(makeMapStateToProps, mapDispatchToProps, mergeProps),
  DragSource('drag', dragSourceSpec, dragSourceCollect)
)(EventCell)
