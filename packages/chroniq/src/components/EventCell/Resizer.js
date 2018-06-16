import React from 'react'

import { DragSource } from 'react-dnd'

import { connect } from '../../store/connect'
import {
  onEventResizeBegin,
  onEventResize
} from '../../store/actions'

import { compose } from '../../utils/helpers'
import { get } from '@chroniq/chroniq-accessor-helpers'

const Resizer = ({ connectDragSource }) => connectDragSource(
  <div className='chrnq-event-resize-month' />
)

const dragSourceCollect = (connect) => ({
  connectDragSource: connect.dragSource()
})

const dragSourceSpec = {
  beginDrag ({ accessors, event, onEventResizeBegin, onBeginDrag }) {
    onBeginDrag()

    onEventResizeBegin({
      id: get(event, accessors.event.id),
      resourceId: get(event, accessors.event.resourceId),
      start: get(event, accessors.event.start),
      end: get(event, accessors.event.end),
      event
    }, accessors)

    return event
  },

  endDrag ({ onEventResize, onChangeDragState, onEndDrag }, monitor) {
    onEndDrag()

    const result = monitor.getDropResult()
    if (result) {
      delete result.dropEffect
    }

    return onEventResize(result)
  }
}


const mapDispatchToProps = {
  onEventResizeBegin,
  onEventResize
}

export default compose(
  connect(null, mapDispatchToProps, null, {
    areStatesEqual: () => true
  }),
  DragSource('resize', dragSourceSpec, dragSourceCollect)
)(Resizer)
