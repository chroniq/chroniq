import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import YearSelector from './YearSelector.js'

import {
  classNames
} from '../../utils/helpers'

class MonthPicker extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      selected: props.selected,
      year: props.year,
      selectedMonth: props.selected || moment()
    }
    this.state.lines = this.calculateLines(this.state.year, this.state.selectedMonth)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.selected !== prevState.selected) {
      return { selected: nextProps.selected }
    } else return null
  }

  componentDidUpdate () {
    this.selectMonth(this.state.selected)
  }

  generateEntry = (month, selectedMonth, today) => ({
    date: moment(month),
    string: month.format('MMM'),
    isCurrent: month.isSame(today, 'month'),
    isSelected: month.isSame(selectedMonth, 'month')
  })

  calculateLines = (year, selectedMonth) => {
    let lines = [ [] ]
    const firstDayOfYear = moment(year).startOf('year')
    const today = moment()

    const month = moment(firstDayOfYear)
    while (month.isSame(year, 'year')) {
      lines[lines.length - 1].push(this.generateEntry(month, selectedMonth, today))

      if (lines[lines.length - 1].length === 3) {
        lines.push([])
      }

      month.add(1, 'month')
    }

    return lines
  }

  selectPreviousYear = () => {
    const year = moment(this.state.year).subtract(1, 'year')
    const lines = this.calculateLines(year, this.state.selectedMonth)

    this.setState({
      year,
      lines
    })
  }

  selectNextYear = () => {
    const year = moment(this.state.year).add(1, 'year')
    const lines = this.calculateLines(year, this.state.selectedMonth)

    this.setState({
      year,
      lines
    })
  }

  selectMonth = (selectedMonth) => {
    const lines = this.calculateLines(this.state.year, selectedMonth)

    this.setState({
      selectedMonth,
      lines
    })
  }

  onSelectMonth = (selectedMonth) => {
    this.selectMonth(selectedMonth)
    this.props.onSelectMonth(selectedMonth)
  }

  render () {
    return (
      <div className='chrnq-monthpicker'>
        <YearSelector
          year={this.state.year.format('YYYY')}
          onBackPress={this.selectPreviousYear}
          onForwardPress={this.selectNextYear}
        />
        <table className='chrnq-monthpicker-table'>
          <thead>
            <tr>
              <th colSpan='3'>Year</th>
            </tr>
          </thead>
          <tbody>
            { this.renderBody(this.onSelectMonth) }
          </tbody>
        </table>
      </div>
    )
  }

  renderBody = (onClick) => this.state.lines.map((line, index) => (
    <tr key={`month/${index}`}>
      {
        line.map((month, monthIndex) => (
          <td
            key={`month/${index}:${monthIndex}`}
            className={classNames({
              '--is-selected': month.isSelected,
              '--is-current': month.isCurrent
            })}
            onClick={() => onClick(month.date)}
          >
            { month.string }
          </td>
        ))
      }
    </tr>
  ))
}

MonthPicker.propTypes = {

}

export default MonthPicker
