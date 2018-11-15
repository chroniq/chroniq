import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'
import Overlay from 'react-overlays/lib/Overlay'

import dates from '@chroniq/chroniq/lib/utils/dates'
import localizer from '@chroniq/chroniq/lib/localizer'
import { connect } from '@chroniq/chroniq/lib/store/connect'
import { segStyle } from '@chroniq/chroniq/lib/utils/eventLevels'

import {
  chunk,
  classNames,
  getPosition,
  requestAnimationFrame
} from '@chroniq/chroniq/lib/utils/helpers'

import {
  getDate,
  getDayFormat,
  getDateFormat,
  getWeekdayFormat,
  getPopup
} from '@chroniq/chroniq/lib/store/selectors'

import { openDrilldownView } from '@chroniq/chroniq/lib/store/actions'

import Popup from '@chroniq/chroniq/lib/components/Popup/Popup'
import DateContentRow from '@chroniq/chroniq/lib/components/DateContentRow/DateContentRow'
import Header from '@chroniq/chroniq/lib/components/Header/Header'
import DateHeader from '@chroniq/chroniq/lib/components/DateHeader/DateHeader'

class MonthView extends React.PureComponent {
  constructor (...args) {
    super(...args)

    this._bgRows = []
    this._pendingSelection = []
    this.state = {
      rowLimit: 5,
      needLimitMeasure: true
    }
  }

  static getDerivedStateFromProps (props) {
    console.log('test')
    const { redux: { date } } = props
    return {
      needLimitMeasure: !dates.eq(date, this.props.redux.date)
    }
  }

  componentDidMount () {
    let running

    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)

    window.addEventListener(
      'resize',
      (this._resizeListener = () => {
        if (!running) {
          requestAnimationFrame(() => {
            running = false
            this.setState({ needLimitMeasure: true }) //eslint-disable-line
          })
        }
      }),
      false
    )
  }

  componentDidUpdate () {
    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._resizeListener, false)
  }

  getContainer = () => {
    return findDOMNode(this)
  }

  render () {
    const {
      date,
      culture,
      formats: {
        weekdayFormat
      }
    } = this.props.redux

    const {
      className
    } = this.props

    const month = dates.visibleDays(date, culture)
    const weeks = chunk(month, 7)

    this._weekCount = weeks.length

    return (
      <div className={classNames('chrnq-month-view', className)}>
        <div className='chrnq-row chrnq-month-header'>
          {this.renderHeaders(weeks[0], weekdayFormat, culture)}
        </div>
        {weeks.map((week, idx) => this.renderWeek(week, idx))}
        {this.props.redux.popup && this.renderOverlay()}
      </div>
    )
  }

  renderWeek = (week, weekIdx) => {
    let {
      components,
      accessors,
      now,
      resources
    } = this.props

    const { needLimitMeasure, rowLimit } = this.state

    let innerRef = null
    if (weekIdx === 0) {
      innerRef = (ref) => { this.slotRow = ref }
    }

    return (
      <DateContentRow
        monthView
        key={weekIdx}
        innerRef={innerRef}
        container={this.getContainer}
        className='chrnq-month-row'
        now={now}
        range={week}
        resources={resources}
        maxRows={rowLimit}
        renderHeader={this.renderDateHeading}
        renderForMeasure={needLimitMeasure}
        onShowMore={this.handleShowMore}
        onSelect={this.handleSelectEvent}
        onDoubleClick={this.handleDoubleClickEvent}
        onSelectSlot={this.handleSelectSlot}
        components={components}
        accessors={accessors}
      />
    )
  }

  renderDateHeading = ({ date, className, ...props }) => {
    const {
      date: currentDate,
      culture,
      formats: { dateFormat }
    } = this.props.redux

    let isOffRange = dates.month(date) !== dates.month(currentDate)
    let isCurrent = dates.eq(date, currentDate, 'day')
    let label = localizer.format(date, dateFormat, culture)
    let DateHeaderComponent = this.props.components.dateHeader || DateHeader

    return (
      <div
        {...props}
        className={classNames(
          className,
          isOffRange && 'chrnq-off-range',
          isCurrent && 'chrnq-current'
        )}
      >
        <DateHeaderComponent
          label={label}
          date={date}
          isOffRange={isOffRange}
          onDrillDown={e => this.handleHeadingClick(date, e)} />
      </div>
    )
  }

  renderHeaders (row, format, culture) {
    let first = row[0]
    let last = row[row.length - 1]
    let HeaderComponent = this.props.components.header || Header

    return dates.range(first, last, 'day').map((day, idx) => (
      <div key={'header_' + idx} className='chrnq-header' style={segStyle(1, 7)}>
        <HeaderComponent
          date={day}
          label={localizer.format(day, format, culture)}
          localizer={localizer}
          format={format}
          culture={culture}
        />
      </div>
    ))
  }

  renderOverlay () {
    let overlay = (this.state && this.state.overlay) || {}
    let { components } = this.props

    return (
      <Overlay
        rootClose
        placement='bottom'
        container={this}
        show={!!overlay.position}
        onHide={() => this.setState({ overlay: null })}
      >
        <Popup
          eventComponent={components.event}
          eventWrapperComponent={components.eventWrapper}
          position={overlay.position}
          date={overlay.date}
          resources={this.props.resources}
          slotStart={overlay.date}
          slotEnd={overlay.end}
          onSelect={this.handleSelectEvent}
          accessors={this.props.accessors}
        />
      </Overlay>
    )
  }

  measureRowLimit () {
    this.setState({
      needLimitMeasure: false,
      rowLimit: this.slotRow.getRowLimit()
    })
  }

  handleHeadingClick = (date, e) => {
    e.preventDefault()
    this.props.redux.openDrilldownView(date)
  }

  handleShowMore = (events, date, cell, slot) => {
    const { popup, openDrilldownView } = this.props.redux

    if (popup) {
      let position = getPosition(cell, findDOMNode(this))

      this.setState({
        overlay: { date, events, position }
      })
    } else {
      openDrilldownView(date)
    }

    this.props.onShowMore && this.props.onShowMore([events, date, slot])
  }
}

MonthView.defaultProps = {
  now: new Date()
}

MonthView.propTypes = {
  className: PropTypes.any,
  redux: PropTypes.shape({
    culture: PropTypes.string,
    formats: PropTypes.shape({
      dayFormat: PropTypes.string,
      dateFormat: PropTypes.string.isRequired,
      weekdayFormat: PropTypes.string
    }).isRequired,
    date: PropTypes.instanceOf(Date),
    popup: PropTypes.bool,
    openDrilldownView: PropTypes.func.isRequired
  }).isRequired,

  components: PropTypes.shape({
    header: PropTypes.func,
    dateHeader: PropTypes.func,

    event: PropTypes.func,
    eventWrapper: PropTypes.func.isRequired
  }).isRequired,

  accessors: PropTypes.object,

  now: PropTypes.instanceOf(Date),

  onShowMore: PropTypes.func,
  resources: PropTypes.any.isRequired
}

MonthView.title = (date, { formats, culture }) =>
  localizer.format(date, formats.monthHeaderFormat, culture)

MonthView.allowResources = true

const mapStateToProps = (state, props) => {
  return {
    date: getDate(state),
    formats: {
      dayFormat: getDayFormat(state),
      dateFormat: getDateFormat(state),
      weekdayFormat: getWeekdayFormat(state)
    },
    popup: getPopup(state)
  }
}

const mapDispatchToProps = {
  openDrilldownView
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MonthView)
