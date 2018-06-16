import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import dates from '@chroniq/chroniq/lib/utils/dates'
import localizer from '@chroniq/chroniq/lib/localizer'

import Week from '@chroniq/chroniq-view-week'

let rangeCreator = (options) => (date) => Week.range(date, options).filter(
  d => [6, 0].indexOf(d.getDay()) === -1
)

class WorkWeek extends React.PureComponent {
  render () {
    let {
      ...props
    } = this.props

    let getRange = rangeCreator(this.props)

    return <Week {...props} getRange={getRange} />
  }
}

WorkWeek.navigate = (date, action) => {
  switch (action) {
    case 'NAVIGATE_NEXT':
      return moment(date).add(1, 'week').toDate()
    case 'NAVIGATE_PREVIOUS':
      return moment(date).subtract(1, 'week').toDate()
    case 'NAVIGATE_TODAY':
      return new Date()
  }
}

WorkWeek.title = (date, { formats, culture }) => {
  let [ start, ...rest ] = rangeCreator({ culture })(date)
  return localizer.format({
    start,
    end: rest.pop()
  },
  formats.dayRangeHeaderFormat,
  culture
  )
}

WorkWeek.defaultProps = {
  slotDuration: 30,
  isLegend: false,
  minTime: dates.startOf(new Date(), 'day'),
  maxTime: dates.endOf(new Date(), 'day'),
  /* these 2 are needed to satisfy requirements from TimeColumn required props
   * There is a strange bug in React, using ...TimeColumn.defaultProps causes weird crashes
   */
  type: 'gutter',
  now: new Date()
}

WorkWeek.toString = () => 'Arbeitswoche'

WorkWeek.propTypes = {
  date: PropTypes.instanceOf(Date)
}

export default WorkWeek
