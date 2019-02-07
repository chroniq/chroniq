import PropTypes from 'prop-types'
import React from 'react'
import EventRowMixin from '../EventRowMixin/EventRowMixin'

import { get, length } from '../../accessors'

class EventRow extends React.PureComponent {
  render () {
    let {
      segments,
      resources,
      accessors
    } = this.props

    let lastEnd = 1

    return (
      <div className='chrnq-row'>
        {
          segments.reduce((row, { event, left, right, span }, li) => {
            let key = '_lvl_' + li
            let gap = left - lastEnd
            let resourceId = get(event, accessors.event.resourceId)
            let res = length(resources) ? resources.find((resource) => get(resource, accessors.resource.id) === resourceId) : { color: '#1abc9c' }
            let content = EventRowMixin.renderEvent(this.props, event, res)

            if (gap) {
              row.push(EventRowMixin.renderSpan(this.props, gap, key + '_gap'))
            }

            row.push(EventRowMixin.renderSpan(this.props, span, key, content))

            lastEnd = right + 1

            return row
          }, [])
        }
      </div>
    )
  }
}

EventRow.defaultProps = {
  ...EventRowMixin.defaultProps
}

EventRow.propTypes = {
  segments: PropTypes.array,
  ...EventRowMixin.propTypes
}

export default EventRow
