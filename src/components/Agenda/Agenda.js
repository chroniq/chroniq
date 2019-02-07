import PropTypes from 'prop-types'
import React from 'react'

import localizer from '../../localizer'
import dates from '../../utils/dates'

import { navigate } from '../../store/actions'
import { get, length } from '../../accessors'
import { connect } from '../../store/connect'
import { getWidth } from '../../utils/helpers'

import {
  getDate,
  getAgendaDateFormat,
  getAgendaTimeFormat,
  getAgendaTimeRangeFormat,
  getMessages
} from '../../store/selectors'

import {
  makeGetEventsForResourcesAndRange
} from '../../selectors/events'

navigate.registerView('agenda', (date, action) => {
  switch (action) {
    case navigate.TODAY:
      return new Date()

    case navigate.NEXT:
      return dates.add(date, 1, 'month')

    case navigate.PREVIOUS:
      return dates.add(date, -1, 'month')
  }
})

class Agenda extends React.PureComponent {
  componentDidMount () {
    this._adjustHeader()
  }

  componentDidUpdate () {
    this._adjustHeader()
  }

  setHeaderRef = (ref) => {
    this.headerRef = ref
  }

  setDateColRef = (ref) => {
    this.dateColRef = ref
  }

  setResourceColRef = (ref) => {
    this.resourceColRef = ref
  }

  setTimeColRef = (ref) => {
    this.timeColRef = ref
  }

  setContentRef = (ref) => {
    this.contentRef = ref
  }

  setTbodyRef = (ref) => {
    this.tbodyRef = ref
  }

  render () {
    let {
      accessors
    } = this.props

    let {
      events,
      date,
      messages
    } = this.props.redux

    const end = dates.endOf(date, 'month')

    const range = dates.range(dates.startOf(date, 'month'), end, 'day')

    events.sort((a, b) => +get(a, accessors.event.start) - +get(b, accessors.event.start))
    events = events.reduce((result, event) => {
      let date = get(event, accessors.event.start)
      const end = get(event, accessors.event.end)

      const dateRange = []
      while (dates.lte(date, end, 'day')) {
        dateRange.push(date)
        date = dates.add(date, 1, 'day')
      }

      dateRange.forEach((date) => {
        if (!result[date.toDateString()]) {
          result[date.toDateString()] = []
        }

        result[date.toDateString()] = result[date.toDateString()].concat(event)
      })

      return result
    }, {})

    return (
      <div className='chrnq-agenda-view'>
        <table ref={this.setHeaderRef}>
          <thead>
            <tr>
              <th className='chrnq-header' ref={this.setDateColRef}>
                {messages.date}
              </th>
              {
                length(this.props.resources) > 1 && (
                  <th className='chrnq-header' ref={this.setResourceColRef}>
                    {messages.resource}
                  </th>
                )
              }
              <th className='chrnq-header' ref={this.setTimeColRef}>
                {messages.time}
              </th>
              <th className='chrnq-header'>
                {messages.event}
              </th>
            </tr>
          </thead>
        </table>
        <div className='chrnq-agenda-content' ref={this.setContentRef}>
          <table>
            <tbody ref={this.setTbodyRef}>
              { range.map((day, idx) => this.renderDay(day, events[day.toDateString()] || [], idx)) }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderDay = (day, events, dayKey) => {
    let {
      culture,
      components,
      accessors,
      selectedEvents,
      resources
    } = this.props

    let {
      formats: {
        agendaDateFormat
      }
    } = this.props.redux

    let EventComponent = components.event
    let DateComponent = components.date

    const eventsByResourceId = events.reduce((result, event) => {
      let resourceId = get(event, accessors.event.resourceId)

      if (!result[resourceId]) {
        result[resourceId] = []
      }
      result[resourceId] = result[resourceId].concat(event)

      return result
    }, {})

    let datePrinted = false

    return resources.map((resource, resourceIdx) => {
      let resourceId = get(resource, accessors.resource.id)
      return (eventsByResourceId[resourceId] || [])
        .map((event, idx) => {
          let dateLabel = idx === 0 && localizer.format(day, agendaDateFormat, culture)
          let first = idx === 0 && !datePrinted
            ? [
              <td key='date' rowSpan={length(events)} className='chrnq-agenda-date-cell'>
                { DateComponent
                  ? <DateComponent day={day} label={dateLabel} />
                  : dateLabel
                }
              </td>
            ]
            : []

          if (first.length > 0) {
            datePrinted = true
          }

          const resourceId = get(resource, accessors.resource.id)
          idx === 0 && length(resources) > 1 && first.push(
            <td key='resource' rowSpan={length(eventsByResourceId[resourceId])} className='chrnq-agenda-resource-cell'>
              {
                get(resource, accessors.resource.title)
              }
            </td>
          )

          let title = get(event, accessors.event.title)

          return (
            <tr key={dayKey + '_' + idx}>
              { first }
              <td className='chrnq-agenda-time-cell'>
                { this.timeRangeLabel(day, event) }
              </td>
              <td className='chrnq-agenda-event-cell'>
                { EventComponent
                  ? <EventComponent event={event} title={title} />
                  : title
                }
              </td>
            </tr>
          )
        }, [])
    })
  };

  timeRangeLabel = (day, event) => {
    let {
      accessors,
      culture,
      components
    } = this.props

    let {
      messages,
      formats
    } = this.props.redux

    let labelClass = ''
    let TimeComponent = components.time
    let label = messages.allDay

    let start = get(event, accessors.event.start)
    let end = get(event, accessors.event.end)

    if (!get(event, accessors.event.allDay)) {
      if (dates.eq(start, end, 'day')) {
        label = localizer.format({ start, end }, formats.agendaTimeRangeFormat, culture)
      } else if (dates.eq(day, start, 'day')) {
        label = localizer.format(start, formats.agendaTimeFormat, culture)
      } else if (dates.eq(day, end, 'day')) {
        label = localizer.format(end, formats.agendaTimeFormat, culture)
      }
    }

    if (dates.gt(day, start, 'day')) labelClass = 'chrnq-continues-prior'
    if (dates.lt(day, end, 'day')) labelClass += ' chrnq-continues-after'

    return (
      <span className={labelClass.trim()}>
        { TimeComponent
          ? <TimeComponent event={event} day={day} label={label} />
          : label
        }
      </span>
    )
  };

  _adjustHeader = () => {
    let header = this.headerRef
    let firstRow = this.tbodyRef.firstChild

    if (!firstRow) { return }

    // let isOverflowing = this.contentRef.scrollHeight > this.contentRef.clientHeight
    let widths = this._widths || []

    this._widths = [
      getWidth(firstRow.children[0]),
      getWidth(firstRow.children[1]),
      getWidth(firstRow.children[2])
    ]

    const setWidth = (ref, width) => {
      ref.style.width = width
      ref.style.maxWidth = width
    }

    if (this._widths.some((width, index) => width !== widths[index] && index < (length(this.props.resources) > 1 ? 3 : 2))) {
      setWidth(this.dateColRef, this._widths[0] + 'px')

      if (length(this.props.resources) > 1) {
        setWidth(this.resourceColRef, this._widths[1] + 'px')
        setWidth(this.timeColRef, this._widths[2] + 'px')
      } else {
        setWidth(this.timeColRef, this._widths[1] + 'px')
      }
    }
  };
}

Agenda.title = (start, { formats, culture }) => {
  start = dates.startOf(start, 'month')
  let end = dates.add(start, 1, 'month')

  let range = { start, end }
  return localizer.format(range, formats.dayRangeHeaderFormat, culture)
}

Agenda.defaultProps = {
  length: 30
}

Agenda.propTypes = {
  accessors: PropTypes.object,
  selectedEvents: PropTypes.array,
  culture: PropTypes.string,
  components: PropTypes.object.isRequired,
  resources: PropTypes.any.isRequired,
  redux: PropTypes.shape({
    events: PropTypes.any,
    date: PropTypes.instanceOf(Date),
    messages: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string
    }),
    formats: PropTypes.shape({
      agendaDateFormat: PropTypes.string,
      agendaTimeFormat: PropTypes.string,
      agendaTimeRangeFormat: PropTypes.func
    })
  })
}

const makeMapStateToProps = () => {
  const getEventsForResourcesAndRange = makeGetEventsForResourcesAndRange()

  return (state, props) => {
    let { resources, accessors } = props
    let date = dates.startOf(getDate(state), 'month')
    let range = dates.range(date, dates.endOf(date, 'month'), 'day')
    let events = getEventsForResourcesAndRange(state, resources, accessors, range)

    return {
      events,
      date,
      messages: getMessages(state),
      formats: {
        agendaDateFormat: getAgendaDateFormat(state),
        agendaTimeFormat: getAgendaTimeFormat(state),
        agendaTimeRangeFormat: getAgendaTimeRangeFormat(state)
      }
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default connect(makeMapStateToProps, null, mergeProps)(Agenda)
