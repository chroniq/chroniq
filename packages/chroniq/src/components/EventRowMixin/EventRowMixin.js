import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'

import { getHeight } from '../../utils/helpers'
import { segStyle } from '../../utils/eventLevels'
import { isSelected } from '../../utils/selection'
import { get } from '@chroniq/chroniq-accessor-helpers'
import EventCell from '../EventCell/EventCell'

/* eslint-disable react/prop-types */
export default {
  propTypes: {
    slots: PropTypes.number.isRequired,
    end: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),
    selectedEvents: PropTypes.array,
    accessors: PropTypes.object,
    eventComponent: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    eventWrapperComponent: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    onSelect: PropTypes.func,
    onDoubleClick: PropTypes.func
  },

  defaultProps: {
    segments: [],
    selectedEvents: [],
    slots: 7
  },

  renderEvent (props, event, resource = {}) {
    let {
      selectedEvents,
      start,
      end,
      accessors,
      eventComponent,
      eventWrapperComponent,
      onSelect,
      onDoubleClick
    } = props

    let eventColor = get(event, accessors.event.color)
    let resourceColor = get(resource, accessors.resource.color)
    let color = eventColor || resourceColor
    let selected = isSelected(event, accessors, selectedEvents)

    return (
      <EventCell
        event={event}
        color={color}
        eventWrapperComponent={eventWrapperComponent}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
        selected={selected}
        accessors={accessors}
        slotStart={start}
        slotEnd={end}
        eventComponent={eventComponent}
      />
    )
  },

  renderSpan (props, len, key, content = ' ') {
    let { slots } = props

    return (
      <div key={key} className='chrnq-row-segment' style={segStyle(Math.abs(len), slots)}>
        {content}
      </div>
    )
  },

  getRowHeight () {
    getHeight(findDOMNode(this))
  }
}
