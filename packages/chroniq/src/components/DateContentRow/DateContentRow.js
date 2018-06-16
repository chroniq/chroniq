import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'

import dates from '../../utils/dates'

import { get, length, toArray } from '@chroniq/chroniq-accessor-helpers'
import {
  classNames,
  querySelectorAll,
  getHeight
} from '../../utils/helpers'
import {
  segStyle,
  eventSegments,
  endOfRange,
  eventLevels
} from '../../utils/eventLevels'
import { connect } from '../../store/connect'

import { makeGetEventsForResourcesAndRange } from '../../selectors/events'
import { onSelectSlot } from '../../store/actions'

import BackgroundCells from '../BackgroundCells/BackgroundCells'
import EventRow from '../EventRow/EventRow'
import EventEndingRow from '../EventEndingRow/EventEndingRow'

let isSegmentInSlot = (seg, slot) => seg.left <= slot && seg.right >= slot

class DateContentRow extends React.PureComponent {
  componentDidMount () {
    typeof this.props.innerRef === 'function' && this.props.innerRef(this)
  }

  handleSelectSlot = (slot) => {
    const range = this.props.range.slice(
      slot.start,
      slot.end + 1
    )

    this.props.redux.onSelectSlot({
      slots: range,
      start: range[0],
      end: range[range.length - 1],
      action: slot.action,
      resources: this.props.resources
    })
  }

  handleShowMore = (slot) => {
    const { range, onShowMore } = this.props
    let row = querySelectorAll(findDOMNode(this), '.chrnq-row-bg')[0]

    let cell
    if (row) {
      cell = row.children[slot-1]
    }

    let events = this.segments
      .filter(seg => isSegmentInSlot(seg, slot))
      .map(seg => seg.event)

    onShowMore(events, range[slot-1], cell, slot)
  }

  createHeadingRef = r => {
    this.headingRow = r
  }

  createEventRef = r => {
    this.eventRow = r
  }

  getContainer = () => {
    const { container } = this.props
    return container ? container() : findDOMNode(this)
  }

  getRowLimit () {
    let eventHeight = getHeight(this.eventRow)
    let headingHeight = this.headingRow ? getHeight(this.headingRow) : 0
    let eventSpace = getHeight(findDOMNode(this)) - headingHeight

    return Math.max(Math.floor(eventSpace / eventHeight), 1)
  }

  render () {
    const {
      events
    } = this.props.redux

    const {
      resources,
      range,
      className,
      renderForMeasure,
      renderHeader,
      minRows, maxRows,
      components,
      onSelectStart,
      onSelectEnd,
      monthView,
      accessors
    } = this.props

    if (renderForMeasure) {
      return this.renderDummy()
    }

    let { first, last } = endOfRange(range)

    this.segments = toArray(events.map(evt => eventSegments(evt, first, last, accessors.event, range)))

    let { levels, extra } = eventLevels(this.segments, Math.max(maxRows - 1, 1))
    while (levels.length < minRows) {
      levels.push([])
    }

    return (
      <div className={className}>
        {
          length(resources) <= 0 && length(resources) > 1 && !monthView
            ? (
              <div className='chrnq-resource-captions-row'>
                {
                  range.map((_, dayIndex) => resources.map((resource) => (
                    <div
                      className='chrnq-resource-caption'
                      key={`resource_captions/${dayIndex}/${get(resource, accessors.resource.id)}`}
                    >
                      {
                        get(resource, accessors.resource.title)
                      }
                    </div>
                  )))
                }
              </div>
            )
            : (
              <React.Fragment>
                <BackgroundCells
                  monthView={monthView}
                  range={range}
                  resources={resources}
                  accessors={accessors}
                  container={this.getContainer}
                  onSelectStart={onSelectStart}
                  onSelectEnd={onSelectEnd}
                  onSelectSlot={this.handleSelectSlot}
                  cellWrapperComponent={components.dateCellWrapper}
                />

                <div className='chrnq-row-content'>
                  {
                    renderHeader && (
                      <div className='chrnq-row' ref={this.createHeadingRef}>
                        { range.map(this.renderHeadingCell) }
                      </div>
                    )
                  }
                  {
                    levels.map((segs, idx) => (
                      <EventRow
                        resources={resources}
                        key={idx}
                        start={first}
                        end={last}
                        segments={segs}
                        slots={range.length}
                        eventComponent={components.event}
                        eventWrapperComponent={components.eventWrapper}
                        accessors={this.props.accessors}
                      />
                    ))
                  }

                  {
                    !!extra.length && (
                      <EventEndingRow
                        resources={resources}
                        start={first}
                        end={last}
                        segments={extra}
                        onShowMore={this.handleShowMore}
                        eventComponent={components.event}
                        eventWrapperComponent={components.eventWrapper}
                        accessors={this.props.accessors}
                      />
                    )
                  }
                </div>
              </React.Fragment>
            )
        }
      </div>
    )
  }

  renderHeadingCell = (date, index) => {
    let { renderHeader, range } = this.props

    return renderHeader({
      date,
      key: `header_${index}`,
      style: segStyle(1, range.length),
      className: classNames(
        'chrnq-date-cell',
        dates.eq(date, this.props.now, 'day') && 'chrnq-now', // FIXME use props.now
      )
    })
  }

  renderDummy = () => {
    let {
      className,
      range,
      renderHeader
    } = this.props

    return (
      <div className={className}>
        <div className='chrnq-row-content'>
          {renderHeader && (
            <div className='chrnq-row' ref={this.createHeadingRef}>
              {range.map(this.renderHeadingCell)}
            </div>
          )}
          <div className='chrnq-row' ref={this.createEventRef}>
            <div className='chrnq-row-segment' style={segStyle(1, range.length)}>
              <div className='chrnq-event'>
                <div className='chrnq-event-content'>
                  <div className='chrnq-month-event'>
                    <span className='chrnq-month-event-title'> &nbsp; </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DateContentRow.defaultProps = {
  minRows: 0,
  maxRows: Infinity
}

DateContentRow.propTypes = {
  className: PropTypes.any,

  accessors: PropTypes.object,

  innerRef: PropTypes.func,
  range: PropTypes.array.isRequired,

  renderForMeasure: PropTypes.bool,
  renderHeader: PropTypes.func,

  container: PropTypes.func,

  onShowMore: PropTypes.func,
  onSelectSlot: PropTypes.func,
  onSelectEnd: PropTypes.func,
  onSelectStart: PropTypes.func,

  now: PropTypes.instanceOf(Date).isRequired,

  resources: PropTypes.any.isRequired,

  monthView: PropTypes.bool,

  components: PropTypes.shape({
    dateCellWrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    event: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]),
    eventWrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]).isRequired
  }).isRequired,
  minRows: PropTypes.number.isRequired,
  maxRows: PropTypes.number.isRequired,
  redux: PropTypes.shape({
    events: PropTypes.any.isRequired
  }).isRequired
}

const makeMapStateToProps = () => {
  const getEventsForResourcesAndRange = makeGetEventsForResourcesAndRange()

  return (state, props) => {
    let { resources, accessors, range } = props
    let events = getEventsForResourcesAndRange(state, resources, accessors, range)

    if (!props.monthView) {
      events = events
        .filter((event) => {
          const eStart = get(event, props.accessors.event.start)
          const eEnd = get(event, props.accessors.event.end)

          if (
            get(event, props.accessors.event.allDay) || (
              dates.isJustDate(eStart) && dates.isJustDate(eEnd)
            )) {
            return true
          } else {
            return false
          }
        })
    }

    return {
      events
    }
  }
}

const mapDispatchToProps = {
  onSelectSlot
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default connect(makeMapStateToProps, mapDispatchToProps, mergeProps)(DateContentRow)
