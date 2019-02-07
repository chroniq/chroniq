import PropTypes from 'prop-types'
import React from 'react'

import dates from '../../utils/dates'
import localizer from '../../localizer'
import { connect } from '../../store/connect'
import { getDate } from '../../store/selectors'

import TimeGrid from '../TimeGrid/TimeGrid'

class WeekView extends React.PureComponent {
  render () {
    const { accessors } = this.props
    const { date } = this.props.redux
    let range = (this.props.getRange && this.props.getRange(date)) || WeekView.range(date, accessors)

    return (
      <TimeGrid
        accessors={accessors}
        components={this.props.components}
        resources={this.props.resources}
        layoutStrategies={this.props.layoutStrategies}
        onScroll={this.props.onScroll}
        setScrollRef={this.props.setScrollRef}
        setTimeScaleRef={this.props.setTimeScaleRef}
        setAllDayRef={this.props.setAllDayRef}
        range={range}
        eventOffset={15}
      />
    )
  }
}

WeekView.range = (date, { culture }) => {
  let firstOfWeek = localizer.startOfWeek(culture)
  let start = dates.startOf(date, 'week', firstOfWeek)
  let end = dates.endOf(date, 'week', firstOfWeek)

  return dates.range(start, end)
}

WeekView.title = (date, { formats, culture }) => {
  let [start, ...rest] = WeekView.range(date, { culture })
  return localizer.format(
    { start, end: rest.pop() },
    formats.dayRangeHeaderFormat,
    culture
  )
}

WeekView.allowResources = true

WeekView.defaultProps = {
  slotDuration: 30,
  isLegend: false,
  /* these 2 are needed to satisfy requirements from TimeColumn required props
   * There is a strange bug in React, using ...TimeColumn.defaultProps causes weird crashes
   */
  type: 'gutter',
  now: new Date()
}

WeekView.propTypes = {
  redux: PropTypes.shape({
    date: PropTypes.instanceOf(Date).isRequired
  }).isRequired,

  accessors: PropTypes.object,

  components: PropTypes.object.isRequired,
  resources: PropTypes.any.isRequired,
  layoutStrategies: PropTypes.object.isRequired,

  onScroll: PropTypes.func,
  setScrollRef: PropTypes.func,
  getRange: PropTypes.func,
  setTimeScaleRef: PropTypes.func,
  setAllDayRef: PropTypes.func
}

const mapStateToProps = (state, props) => ({
  redux: {
    date: getDate(state)
  }
})

export default connect(mapStateToProps)(WeekView)
