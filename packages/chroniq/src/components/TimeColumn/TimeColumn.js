import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'
import SmartComponent from '@incoqnito.io/smart-component'

import Selection, { getBoundsForNode, isEvent } from '../Selection/Selection'
import localizer from '../../localizer'
import dates from '../../utils/dates'

import { connect } from '../../store/connect'
import { getRealMinTime, getRealMaxTime, getSlotDuration, getSlotInterval, getTimeGutterFormat,
  getSelectRangeFormat, getCulture, getSelectable } from '../../store/selectors'
import { onSelectSlot } from '../../store/actions'
import { classNames, compose } from '../../utils/helpers'

import BackgroundWrapper from '../BackgroundWrapper/BackgroundWrapper'
import TimeSlotGroup from '../TimeSlotGroup/TimeSlotGroup'
import { positionFromDate } from '../../utils/dayViewLayout'

function snapToSlot (date, slotDuration) {
  var roundTo = 1000 * 60 * slotDuration
  return new Date(Math.floor(date.getTime() / roundTo) * roundTo)
}

function minToDate (minTime, date) {
  let dt = new Date(date)
  let totalMinTime = dates.diff(dates.startOf(date, 'day'), date, 'minutes')

  dt = dates.hours(dt, 0)
  dt = dates.minutes(dt, totalMinTime + minTime)
  dt = dates.seconds(dt, 0)
  return dates.milliseconds(dt, 0)
}

class TimeColumn extends React.Component {
  state = {
    selecting: false
  }

  componentDidMount () {
    this.props.redux.selectable && !this.props.isLegend &&
    this._selectable()
  }

  componentWillUnmount () {
    this._teardownSelectable()
  }

  componentDidUpdate (prevProps) {
    if (this.props.redux.selectable && !prevProps.redux.selectable && !prevProps.isLegend) { this._selectable() }
    if (!this.props.redux.selectable && prevProps.redux.selectable && !prevProps.isLegend) { this._teardownSelectable() }
  }

  renderTimeSliceGroup (key, isNow, date) {
    const {
      components,
      isLegend,
      showLabels,
      accessors,
      resources,
      slotDuration,
      slotInterval
    } = this.props

    const {
      culture,
      formats: {
        timeGutterFormat
      }
    } = this.props.redux

    return (
      <TimeSlotGroup
        key={key}
        isNow={isNow}
        value={date}
        resources={resources}
        slotDuration={slotDuration}
        culture={culture}
        slotInterval={slotInterval}
        isLegend={isLegend}
        showLabels={showLabels}
        timeGutterFormat={timeGutterFormat}
        dayWrapperComponent={components.dayWrapper}
        accessors={accessors}
      />
    )
  }

  getTotalTime(minTime, maxTime) {
    return dates.diff(minTime, maxTime, 'minutes')
  }

  render () {
    const {
      className,
      children,
      style,
      now,
      minTime,
      maxTime,
      slotDuration,
      slotInterval,
    } = this.props

    const {
      culture,
      selectable,
      formats: {
        selectRangeFormat
      }
    } = this.props.redux

    const totalTime = this.getTotalTime(minTime, maxTime)
    const numGroups = Math.ceil(totalTime / (slotDuration * slotInterval))
    const renderedSlots = []
    const groupLengthInMinutes = slotDuration * slotInterval

    let date = dates.merge(this.props.date, minTime)
    let next = date
    let isNow = false

    let { selecting, startSlot, endSlot } = this.state
    let layoverStyle = this._slotStyle(startSlot, endSlot, totalTime)

    let selectDates = {
      start: this.state.startDate,
      end: this.state.endDate
    }

    for (var i = 0; i < numGroups; i++) {
      isNow = dates.inRange(
        now,
        date,
        dates.add(next, groupLengthInMinutes - 1, 'minutes'),
        'minutes'
      )

      next = dates.add(date, groupLengthInMinutes, 'minutes')
      renderedSlots.push(this.renderTimeSliceGroup(i, isNow, date))

      date = next
    }

    return (
      <div
        className={classNames(className, 'chrnq-time-column')}
        style={style}
        ref={this.props.innerRef}
      >
        <div className='chrnq-time-column-slots'>
          {renderedSlots}
        </div>
        {children}

        {selectable && (
          <div className='chrnq-hightlight-container'>
            {selecting && (
              <div className='chrnq-selection' style={layoverStyle}>
                { localizer.format(selectDates, selectRangeFormat, culture) }
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  _slotStyle = (startSlot, endSlot, totalTime) => {
    let top = ((startSlot / totalTime) * 100)
    let bottom = ((endSlot / totalTime) * 100)

    return {
      top: top + '%',
      height: bottom - top + '%'
    }
  };

  _selectable = () => {
    const findSlotNode = () => findDOMNode(this).childNodes[0]
    let node = findSlotNode()
    let selector = this._selector = new Selection(() => findSlotNode(), {
      longPressThreshold: this.props.longPressThreshold
    })

    let maybeSelect = (box) => {
      let onSelecting = this.props.onSelecting
      let current = this.state || {}
      let state = selectionState(box)
      let { startDate: start, endDate: end } = state

      if (onSelecting) {
        if (
          (dates.eq(current.startDate, start, 'minutes') &&
          dates.eq(current.endDate, end, 'minutes')) ||
          onSelecting({ start, end }) === false
        ) { return }
      }

      this.setState(state)
    }

    let selectionState = ({ y }) => {
      const {
        slotDuration,
        minTime,
        maxTime
      } = this.props
      let { top, bottom } = getBoundsForNode(node)

      let totalMinTime = this.getTotalTime(minTime, maxTime)

      let range = Math.abs(top - bottom)

      let current = (y - top) / range

      current = snapToSlot(minToDate(totalMinTime * current, minTime), slotDuration)

      if (!this.state.selecting) {
        this._initialDateSlot = current
      }

      let initial = this._initialDateSlot

      if (dates.eq(initial, current, 'minutes')) {
        current = dates.add(current, slotDuration, 'minutes')
      }

      let start = dates.max(minTime, dates.min(initial, current))
      let end = dates.min(maxTime, dates.max(initial, current))

      return {
        selecting: true,
        startDate: start,
        endDate: end,
        startSlot: positionFromDate(start, minTime, totalMinTime),
        endSlot: positionFromDate(end, minTime, totalMinTime)
      }
    }

    selector.on('selecting', maybeSelect)
    selector.on('selectStart', maybeSelect)

    selector.on('beforeSelect', (box) => {
      if (this.props.redux.selectable !== 'ignoreEvents') {
        return
      }

      return !isEvent(findSlotNode(), box)
    })

    selector.on('click', (box) => {
      if (!isEvent(findSlotNode(), box)) {
        this._selectSlot({ ...selectionState(box), action: 'click' })
      }

      this.setState({ selecting: false })
    })

    selector.on('select', () => {
      if (this.state.selecting) {
        this._selectSlot({ ...this.state, action: 'select' })
        this.setState({ selecting: false })
      }
    })

    selector.on('reset', () => {
      this.setState({ selecting: false })
    })
  };

  _teardownSelectable = () => {
    if (!this._selector) {
      return
    }
    this._selector.teardown()
    this._selector = null
  };

  _selectSlot = ({ startDate, endDate, action }) => {
    let current = startDate
    let slots = []

    while (dates.lte(current, endDate)) {
      slots.push(current)
      current = dates.add(current, this.props.slotDuration, 'minutes')
    }

    this.props.redux.onSelectSlot({
      slots,
      action,
      start: startDate,
      end: endDate,
      resources: this.props.resources
    })
  };
}

TimeColumn.defaultProps = {
  isLegend: false,
  showLabels: false,
  type: 'day',
  className: '',
  dayWrapperComponent: BackgroundWrapper
}

TimeColumn.propTypes = {
  redux: PropTypes.shape({
    selectable: PropTypes.oneOf([ true, false, 'ignoreEvents' ]),
    culture: PropTypes.string,
    formats: PropTypes.shape({
      timeGutterFormat: PropTypes.string.isRequired
    }).isRequired,
    onSelectSlot: PropTypes.func.isRequired
  }).isRequired,
  minTime: PropTypes.instanceOf(Date).isRequired,
  maxTime: PropTypes.instanceOf(Date).isRequired,
  slotDuration: PropTypes.number.isRequired,
  slotInterval: PropTypes.number.isRequired,
  onSelecting: PropTypes.func,
  accessors: PropTypes.object,
  components: PropTypes.shape({
    dayWrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }).isRequired,
  date: PropTypes.instanceOf(Date),
  now: PropTypes.instanceOf(Date).isRequired,
  resources: PropTypes.any.isRequired,
  showLabels: PropTypes.bool,
  isLegend: PropTypes.bool,
  className: PropTypes.string,
  longPressThreshold: PropTypes.number,
  selectRangeFormat: PropTypes.string,
  innerRef: PropTypes.func
}

const mapStateToProps = (state) => ({
  culture: getCulture(state),
  formats: {
    selectRangeFormat: getSelectRangeFormat(state),
    timeGutterFormat: getTimeGutterFormat(state)
  },
  selectable: getSelectable(state)
})

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

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  SmartComponent({
    'minTime': (a, b) => a.getTime() === b.getTime(),
    'maxTime': (a, b) => a.getTime() === b.getTime(),
    'redux': {
      'formats': {},
      'onSelectSlot': () => true
    },
    'innerRef': () => true,
    'style': {}
  })
)(TimeColumn)
