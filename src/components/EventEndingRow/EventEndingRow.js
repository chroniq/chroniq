import PropTypes from 'prop-types'
import React from 'react'
import EventRowMixin from '../EventRowMixin/EventRowMixin'
import { eventLevels } from '../../utils/eventLevels'
import { prepareMessages } from '../../models/message'
import { range } from '../../utils/helpers'
import { get, length } from '../../accessors'

let isSegmentInSlot = (seg, slot) => seg.left <= slot && seg.right >= slot
let eventsInSlot = (segments, slot) =>
  segments.filter(seg => isSegmentInSlot(seg, slot)).length

class EventEndingRow extends React.PureComponent {
  render () {
    let {
      segments,
      slots,
      accessors,
      resources
    } = this.props
    let rowSegments = eventLevels(segments).levels[0]

    let current = 1
    let lastEnd = 1
    let row = []

    while (current <= slots) {
      let key = '_lvl_' + current

      let { event, left, right, span } = rowSegments.filter(seg =>
        isSegmentInSlot(seg, current)
      )[0] || {} //eslint-disable-line

      if (!event) {
        current++
        continue
      }

      let gap = Math.max(0, left - lastEnd)
      let resourceId = get(event, accessors.event.resourceId)

      if (this.canRenderSlotEvent(left, span)) {
        let content = EventRowMixin.renderEvent(this.props, event, length(resources) && resources.find((resource) => get(resource, accessors.resource.id) === resourceId))

        if (gap) {
          row.push(EventRowMixin.renderSpan(this.props, gap, key + '_gap'))
        }

        row.push(EventRowMixin.renderSpan(this.props, span, key, content))

        lastEnd = current = right + 1
      } else {
        if (gap) {
          row.push(EventRowMixin.renderSpan(this.props, gap, key + '_gap'))
        }

        row.push(
          EventRowMixin.renderSpan(
            this.props,
            1,
            key,
            this.renderShowMore(segments, current)
          )
        )
        lastEnd = current = current + 1
      }
    }

    return (
      <div className='chrnq-row'>
        {row}
      </div>
    )
  }

  canRenderSlotEvent (slot, span) {
    let { segments } = this.props

    return range(slot, slot + span).every(s => {
      let count = eventsInSlot(segments, s)

      return count === 1
    })
  }

  renderShowMore (segments, slot) {
    let count = eventsInSlot(segments, slot)
    if (!count) {
      return null
    }

    let messages = prepareMessages(this.props.messages)
    return (
      <div className='chrnq-show-more'>
        <span
          key={'sm_' + slot}
          className='chrnq-show-more-content'
          onClick={e => this.showMore(slot, e)}
        >
          {messages.showMore(count)}
        </span>
      </div>
    )
  }

  showMore (slot, e) {
    e.preventDefault()
    this.props.onShowMore(slot)
  }
}

EventEndingRow.defaultProps = {
  ...EventRowMixin.defaultProps
}

EventEndingRow.propTypes = {
  segments: PropTypes.array,
  slots: PropTypes.number,
  messages: PropTypes.object,
  onShowMore: PropTypes.func,
  ...EventRowMixin.propTypes
}

export default EventEndingRow
