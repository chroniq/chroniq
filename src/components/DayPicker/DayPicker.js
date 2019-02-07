import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import MonthSelector from './MonthSelector.js'

import { classNames } from '../../utils/helpers'

class DayPicker extends React.PureComponent {
  state = {
    month: null,
    selected: null,
    lines: []
  }

  componentWillMount () {
    let { month, selected } = this.props
    this.setState({
      month: month,
      selectedDay: selected || moment(),
      lines: this.calculateLines(month)
    })
  }

  componentWillReceiveProps (newProps) {
    if (newProps.selected !== this.props.selected) {
      this.selectDay(newProps.selected)
    }
  }

  generateEntry = (day, today, selectedDay, month) => ({
    date: moment(day),
    string: day.format('D'),
    isToday: day.isSame(today, 'day'),
    inMonth: day.isSame(month, 'month'),
    isSelected: day.isSame(selectedDay, 'week')
  })

  calculateLines = (month, selectedDay) => {
    let lines = [ [] ]
    const firstDayOfMonth = moment(month).startOf('month')
    const today = moment()

    const day = moment(firstDayOfMonth).startOf('week')
    const endOfWeek = moment(day).endOf('week')
    while (day.isSameOrBefore(month, 'month')) {
      lines[lines.length - 1].push(this.generateEntry(day, today, selectedDay, month))

      if (day.isSame(endOfWeek, 'day')) {
        lines.push([])
        endOfWeek.add(7, 'day').endOf('week')
      }

      day.add(1, 'day')
    }

    if (lines[lines.length - 1].length === 0) { // in case the last day of the month was a sunday
      lines.pop()
    }

    while (lines[lines.length - 1].length < 7) {
      lines[lines.length - 1].push(this.generateEntry(day, today, selectedDay, month))
      day.add(1, 'day')
    }

    return lines
  }

  selectPreviousMonth = () => {
    const month = moment(this.state.month).subtract(1, 'month')
    const lines = this.calculateLines(month, this.state.selectedDay)

    this.setState({
      month,
      lines
    })
  }

  selectNextMonth = () => {
    const month = moment(this.state.month).add(1, 'month')
    const lines = this.calculateLines(month, this.state.selectedDay)

    this.setState({
      month,
      lines
    })
  }

  selectDay = (selectedWeek) => {
    const lines = this.calculateLines(this.state.month, selectedWeek)

    this.setState({
      lines,
      selectedWeek
    })
  }

  onSelectDay = (selectedWeek) => {
    this.selectDay(selectedWeek)
    this.props.onSelectDay(selectedWeek)
  }

  render () {
    return (
      <div className='chrnq-daypicker-wrapper'>
        <MonthSelector
          month={this.state.month.format('MMMM YYYY')}
          onBackPress={this.selectPreviousMonth}
          onForwardPress={this.selectNextMonth}
        />
        <table className='chrnq-daypicker-table'>
          <thead>
            <tr>
              {
                this.renderHeader()
              }
            </tr>
          </thead>
          <tbody>
            {
              this.renderBody(this.onSelectDay)
            }
          </tbody>
        </table>
      </div>
    )
  }

  renderHeader = () => {
    const day = moment(this.state.month).startOf('week')
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(day.format('dd').slice(0, 2))
      day.add(1, 'day')
    }

    return days.map((day, index) => (
      <th key={`day/${index}:${day}`}>
        { day }
      </th>
    ))
  }

  renderBody = (onClick) => this.state.lines.map((line, index) => (
    <tr key={`week/${index}`}>
      {
        line.map((day, dayIndex) => (
          <td
            key={`week/${index}:${dayIndex}`}
            onClick={() => onClick(day.date)}
            className={classNames({
              '--is-out-of-range': !day.inMonth,
              '--is-today': day.isToday,
              '--is-selected': day.isSelected
            })}
          >
            <span>{ day.string }</span>
          </td>
        ))
      }
    </tr>
  ))
}

DayPicker.propTypes = {
  selected: PropTypes.any,
  month: PropTypes.any,
  onSelectDay: PropTypes.func.isRequired
}

export default DayPicker
