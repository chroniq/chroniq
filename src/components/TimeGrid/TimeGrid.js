import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'

import dates from '../../utils/dates'
import localizer from '../../localizer'
import DayColumn from '../DayColumn/DayColumn'
import TimeColumn from '../TimeColumn/TimeColumn'
import DateContentRow from '../DateContentRow/DateContentRow'
import Header from '../Header/Header'

import { segStyle } from '../../utils/eventLevels'
import { classNames, getWidth } from '../../utils/helpers'

import { connect } from '../../store/connect'
import { getSlotDuration, getSlotInterval, getDayFormat, getScrollTime, getCulture, getRtl, getMessages, getRealMinTime, getRealMaxTime } from '../../store/selectors'
import { openDrilldownView, onSelectSlot } from '../../store/actions'

class TimeGrid extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      gutterWidth: undefined,
      isOverflowing: null,
      autoScrolled: false
    }

    this.timeContentRef = null
  }

  componentWillMount () {
    this._gutters = []
    this.calculateScroll()
  }

  componentDidMount () {
    this.checkOverflow()

    if (this.props.width == null) {
      this.measureGutter()
    }
    this.applyScroll()

    this.positionTimeIndicator()
    this.triggerTimeIndicatorUpdate()
  }

  componentWillUnmount () {
    window.clearTimeout(this._timeIndicatorTimeout)
  }

  componentDidUpdate () {
    if (this.props.width == null && !this.state.gutterWidth) {
      this.measureGutter()
    }

    this.applyScroll()
    this.positionTimeIndicator()
    // this.checkOverflow()
  }

  componentWillReceiveProps (nextProps) {
    const { range } = this.props
    const { scrollTime } = this.props.redux

    // When paginating, reset scroll
    if (
      !dates.eq(nextProps.range[0], range[0], 'minute') ||
      !dates.eq(nextProps.redux.scrollTime, scrollTime, 'minute')
    ) {
      this.calculateScroll()
    }
  }

  handleSelectAllDaySlot = (slots, slotInfo) => {
    this.props.redux.onSelectSlot({
      slots,
      start: slots[0],
      end: slots[slots.length - 1],
      action: slotInfo.action,
      resources: this.props.resources
    })
  }

  setTimeIndicatorRef = (ref) => {
    this.timeIndicatorRef = ref
  }

  render () {
    let {
      range,
      width,
      onScroll,
      setScrollRef,
      now
    } = this.props

    const {
      minTime,
      maxTime,
      slotDuration,
      slotInterval
    } = this.props.redux

    width = width || this.state.gutterWidth

    this.slots = range.length

    let gutterRef = ref => { this._gutters[1] = ref && findDOMNode(ref) }

    return (
      <div className='chrnq-time-view'>

        { this.renderHeader(range, width) }

        <div className='chrnq-time-content' onScroll={onScroll} ref={(ref) => {
          this.contentRef = ref
          setScrollRef && setScrollRef(ref)
        }}>
          <div ref={this.setTimeIndicatorRef} className='chrnq-current-time-indicator' />

          <TimeColumn
            showLabels
            accessors={this.props.accessors}
            resources={this.props.resources}
            components={this.props.components}
            minTime={minTime}
            maxTime={maxTime}
            slotDuration={slotDuration}
            slotInterval={slotInterval}
            style={{ width }}
            innerRef={(ref) => {
              gutterRef(ref)
              this.props.setTimeScaleRef(ref)
            }}
            now={now}
            isLegend
            className='chrnq-time-gutter'
          />

          { this.renderEvents(this.props.range, this.props.now) }

        </div>
      </div>
    )
  }

  renderEvents (range, today) {
    return range.map((date, key) => {
      let className = classNames({ 'chrnq-now': dates.eq(date, today, 'day') })
      let style = segStyle(1, this.slots)
      return (
        <DayColumn
          date={new Date(date)}
          now={this.props.now}
          resources={this.props.resources}
          components={this.props.components}
          accessors={this.props.accessors}
          className={className}
          style={style}
          key={key}
          layoutStrategies={this.props.layoutStrategies}
          timeContentRef={this.contentRef}
          onScroll={this.props.onScroll}
          scrollToEvent={this.props.scrollToEvent}
        />
      )
    })
  }

  renderHeader (range, width) {
    const { messages, rtl } = this.props.redux
    let { now } = this.props
    let { isOverflowing } = this.state || {}

    let style = {}
    if (isOverflowing) {
      style[rtl ? 'marginLeft' : 'marginRight'] = 0 + 'px'
    }

    return (
      <div
        className={classNames(
          'chrnq-time-header',
          isOverflowing && 'chrnq-overflowing'
        )}
        style={style}
      >
        <div className='chrnq-row'>
          <div
            className='chrnq-header'
            style={{ width }}
          />
          { this.renderHeaderCells(range) }
        </div>
        <div className='chrnq-row'>
          <div
            ref={ref => {
              this._gutters[0] = ref
              this.props.setAllDayRef(ref)
            }}
            className='chrnq-label chrnq-header-gutter'
            style={{ width }}
          >
            <span>
              { messages.allDay }
            </span>
          </div>
          <DateContentRow
            resources={this.props.resources}
            now={now}
            minRows={2}
            range={range}
            className='chrnq-allday-cell'
            components={this.props.components}
            accessors={this.props.accessors}
          />
        </div>
      </div>
    )
  }

  renderHeaderCells (range) {
    const {
      components: {
        header: HeaderComponent = Header
      }
    } = this.props

    const {
      formats: {
        dayFormat
      },
      culture
    } = this.props.redux

    return range.map((date, i) => {
      let label = localizer.format(date, dayFormat, culture)

      let header = (
        <HeaderComponent
          date={date}
          label={label}
          localizer={localizer}
          format={dayFormat}
          culture={culture}
        />
      )

      return (
        <div
          key={i}
          className={classNames(
            'chrnq-header',
            dates.isToday(date) && 'chrnq-today',
          )}
          style={segStyle(1, this.slots)}
        >
          <a
            href='#'
            onClick={e => this.handleHeaderClick(date, e)}
          >
            {header}
          </a>
        </div>
      )
    })
  }

  handleHeaderClick (date, e) {
    e.preventDefault()
    this.props.redux.openDrilldownView(date)
  }

  measureGutter () {
    let width = this.state.gutterWidth
    let gutterCells = this._gutters

    if (!width) {
      width = Math.max(...gutterCells.map(getWidth))

      if (width) {
        this.setState({ gutterWidth: width })
      }
    }
  }

  applyScroll () {
    if (this._scrollRatio) {
      const { content } = this.contentRef
      this.contentRef.scrollTop = this.contentRef.scrollHeight * this._scrollRatio
      // Only do this once
      this._scrollRatio = null
    }
  }

  calculateScroll () {
    const {
      minTime,
      maxTime,
      scrollTime
    } = this.props.redux

    const diffMillis = scrollTime - dates.startOf(scrollTime, 'day')
    const totalMillis = dates.diff(maxTime, minTime)

    this._scrollRatio = diffMillis / totalMillis
  }

  checkOverflow () {
    if (this._updatingOverflow) return

    let isOverflowing = this.contentRef.scrollHeight > this.contentRef.clientHeight

    if (this.state.isOverflowing !== isOverflowing) {
      this._updatingOverflow = true
      this.setState({ isOverflowing }, () => {
        this._updatingOverflow = false
      })
    }
  }

  positionTimeIndicator () {
    const {
      rtl,
      minTime,
      maxTime
    } = this.props.redux
    const now = new Date()

    const secondsGrid = dates.diff(maxTime, minTime, 'seconds')
    const secondsPassed = dates.diff(now, minTime, 'seconds')

    const timeIndicator = this.timeIndicatorRef
    const factor = secondsPassed / secondsGrid
    const timeGutter = this._gutters[this._gutters.length - 1]

    if (timeGutter && now >= minTime && now <= maxTime) {
      const pixelHeight = timeGutter.offsetHeight
      const offset = Math.floor(factor * pixelHeight)

      timeIndicator.style.display = 'block'
      timeIndicator.style[rtl ? 'left' : 'right'] = 0
      timeIndicator.style[rtl ? 'right' : 'left'] = timeGutter.offsetWidth + 'px'
      timeIndicator.style.top = offset + 'px'
    }
  }

  triggerTimeIndicatorUpdate () {
    // Update the position of the time indicator every minute
    this._timeIndicatorTimeout = window.setTimeout(() => {
      this.positionTimeIndicator()

      this.triggerTimeIndicatorUpdate()
    }, 60000)
  }
}

TimeGrid.defaultProps = {
  slotDuration: 30,
  isLegend: false,
  /* these 2 are needed to satisfy requirements from TimeColumn required props
   * There is a strange bug in React, using ...TimeColumn.defaultProps causes weird crashes
   */
  type: 'gutter',
  now: new Date()
}

TimeGrid.propTypes = {
  redux: PropTypes.shape({
    slotDuration: PropTypes.number.isRequired,
    slotInterval: PropTypes.number.isRequired,
    rtl: PropTypes.bool,

    culture: PropTypes.string,
    messages: PropTypes.object,
    formats: PropTypes.shape({
      dayFormat: PropTypes.string
    }).isRequired,
    scrollTime: PropTypes.instanceOf(Date),
    minTime: PropTypes.instanceOf(Date).isRequired,
    maxTime: PropTypes.instanceOf(Date).isRequired,
    openDrilldownView: PropTypes.func.isRequired,
    onSelectSlot: PropTypes.func.isRequired
  }).isRequired,

  accessors: PropTypes.object,

  resources: PropTypes.any.isRequired,
  range: PropTypes.arrayOf(
    PropTypes.instanceOf(Date)
  ),
  now: PropTypes.instanceOf(Date),
  width: PropTypes.number,
  components: PropTypes.object.isRequired,
  layoutStrategies: PropTypes.object.isRequired,
  onScroll: PropTypes.func,
  setScrollRef: PropTypes.func,
  setTimeScaleRef: PropTypes.func,
  setAllDayRef: PropTypes.func
}

const mapStateToProps = (state) => ({
  events: state.getIn([ 'props', 'events' ]),
  autoScrollToFirstEvent: state.getIn([ 'props', 'autoScrollToFirstEvent' ]),
  slotDuration: getSlotDuration(state),
  slotInterval: getSlotInterval(state),
  messages: getMessages(state),
  formats: {
    dayFormat: getDayFormat(state)
  },
  culture: getCulture(state),
  rtl: getRtl(state),
  scrollTime: getScrollTime(state),
  minTime: getRealMinTime(state),
  maxTime: getRealMaxTime(state)
})

const mapDispatchToProps = {
  openDrilldownView,
  onSelectSlot
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TimeGrid)
