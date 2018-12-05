import PropTypes from 'prop-types'
import React from 'react'

import dates from '@chroniq/chroniq/lib/utils/dates'
import localizer from '@chroniq/chroniq/lib/localizer'

import { connect } from '@chroniq/chroniq/lib/store/connect'
import { getDate } from '@chroniq/chroniq/lib/store/selectors'

import TimeGrid from '@chroniq/chroniq/lib/components/TimeGrid/TimeGrid'

class Day extends React.PureComponent {
  render () {
    const { date } = this.props.redux

    return (
      <TimeGrid
        showGutter={this.props.showGutter}
        range={[dates.startOf(date, 'day')]}
        eventOffset={10}
        accessors={this.props.accessors}
        components={this.props.components}
        resources={this.props.resources}
        layoutStrategies={this.props.layoutStrategies}
        onScroll={this.props.onScroll}
        setScrollRef={this.props.setScrollRef}
        setTimeScaleRef={this.props.setTimeScaleRef}
        setAllDayRef={this.props.setAllDayRef}
      />
    )
  }
}

Day.allowResources = true

Day.propTypes = {
  redux: PropTypes.shape({
    date: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  resources: PropTypes.any.isRequired,
  layoutStrategies: PropTypes.object.isRequired,
  onScroll: PropTypes.func,
  setScrollRef: PropTypes.func,
  setTimeScaleRef: PropTypes.func,
  setAllDayRef: PropTypes.func
}

Day.title = (date, { formats, culture }) => {
  return localizer.format(date, formats.dayHeaderFormat, culture)
}

const mapStateToProps = (state) => ({
  redux: {
    date: getDate(state)
  }
})

export default connect(mapStateToProps)(Day)
