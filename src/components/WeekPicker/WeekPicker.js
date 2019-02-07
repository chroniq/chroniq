import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import MonthSelector from './MonthSelector.js'

import { classNames } from '../../utils/helpers'

class WeekPicker extends React.PureComponent {
  state = {
    month: null,
    seelcted: null,
    lines: []
  }

  componentWillMount () {
    let { month, selected } = this.props
    this.setState({
      month: month,
      selectedWeek: selected || moment(),
      lines: this.calculateLines(month)
    })
  }

  componentWillReceiveProps (newProps) {
    if (newProps.selected !== this.props.selected) {
      this.selectWeek(newProps.selected)
    }
  }

  generateEntry = (day, today, selectedWeek, month) => ({
    date: moment(day),
    string: day.format('D'),
    isToday: day.isSame(today, 'day'),
    inMonth: day.isSame(month, 'month'),
    isSelected: day.isSame(selectedWeek, 'week')
  })

  calculateLines = (month, selectedWeek) => {
    let lines = [ [] ]
    const firstDayOfMonth = moment(month).startOf('month')
    const today = moment()

    const day = moment(firstDayOfMonth).startOf('week')
    const endOfWeek = moment(day).endOf('week')
    while (day.isSameOrBefore(month, 'month')) {
      lines[lines.length - 1].push(this.generateEntry(day, today, selectedWeek, month))

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
      lines[lines.length - 1].push(this.generateEntry(day, today, selectedWeek, month))
      day.add(1, 'day')
    }

    return lines
  }

  selectPreviousMonth = () => {
    const month = moment(this.state.month).subtract(1, 'month')
    const lines = this.calculateLines(month, this.state.selectedWeek)

    this.setState({
      month,
      lines
    })
  }

  selectNextMonth = () => {
    const month = moment(this.state.month).add(1, 'month')
    const lines = this.calculateLines(month, this.state.selectedWeek)

    this.setState({
      month,
      lines
    })
  }

  selectWeek = (selectedWeek) => {
    const lines = this.calculateLines(this.state.month, selectedWeek)

    this.setState({
      lines,
      selectedWeek
    })
  }

  onSelectWeek = (selectedWeek) => {
    this.selectWeek(selectedWeek)
    this.props.onSelectWeek(selectedWeek)
  }

  render () {
    return (
      <div className='chrnq-weekpicker-wrapper'>
        <MonthSelector
          month={this.state.month.format('MMMM YYYY')}
          onBackPress={this.selectPreviousMonth}
          onForwardPress={this.selectNextMonth}
        />
        <table className='chrnq-weekpicker-table'>
          <thead>
            <tr>
              {
                this.renderHeader()
              }
            </tr>
          </thead>
          <tbody>
            {
              this.renderBody(this.onSelectWeek)
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
    <tr key={`week/${index}`} onClick={() => onClick(line[0].date, line[line.length - 1].date)}>
      {
        line.map((day, dayIndex) => (
          <td key={`week/${index}:${dayIndex}`} className={classNames({
            '--is-out-of-range': !day.inMonth,
            '--is-today': day.isToday,
            '--is-selected': day.isSelected
          })}>
            <span>{ day.string }</span>
          </td>
        ))
      }
    </tr>
  ))
}

WeekPicker.propTypes = {
  selected: PropTypes.any,
  month: PropTypes.any,
  onSelectWeek: PropTypes.func.isRequired
}

export default WeekPicker
