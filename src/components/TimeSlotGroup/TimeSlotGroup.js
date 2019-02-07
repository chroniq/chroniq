import PropTypes from 'prop-types'
import React from 'react'
import TimeSlot from '../TimeSlot/TimeSlot'
import date from '../../utils/dates.js'
import localizer from '../../localizer'

import { get } from '../../accessors'

import SmartComponent from '@incoqnito.io/smart-component'

class TimeSlotGroup extends React.Component {
  renderSlice (slotNumber, content, value) {
    const {
      dayWrapperComponent,
      isLegend,
      showLabels,
      isNow,
      culture,
      resources
    } = this.props

    const showLabel = showLabels && !slotNumber

    return (
      <TimeSlot
        key={slotNumber}
        dayWrapperComponent={dayWrapperComponent}
        showLabel={showLabel}
        content={content}
        culture={culture}
        isLegend={isLegend}
        isNow={isNow}
        value={value}
        resources={resources}
      />
    )
  }

  renderSlices () {
    const ret = []
    const sliceLength = this.props.slotDuration
    let sliceValue = this.props.value
    for (let i = 0; i < this.props.slotInterval; i++) {
      const content = localizer.format(sliceValue, this.props.timeGutterFormat, this.props.culture)
      ret.push(this.renderSlice(i, content, sliceValue))
      sliceValue = date.add(sliceValue, sliceLength, 'minutes')
    }
    return ret
  }

  render () {
    return (
      <div className='chrnq-timeslot-group'>
        {this.renderSlices()}
      </div>
    )
  }
}

TimeSlotGroup.defaultProps = {
  slotInterval: 2,
  slotDuration: 30,
  isNow: false,
  isLegend: false,
  showLabels: false
}

TimeSlotGroup.propTypes = {
  dayWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  resources: PropTypes.any,
  slotInterval: PropTypes.number.isRequired,
  slotDuration: PropTypes.number.isRequired,
  value: PropTypes.instanceOf(Date).isRequired,
  showLabels: PropTypes.bool,
  isNow: PropTypes.bool,
  timeGutterFormat: PropTypes.string,
  isLegend: PropTypes.bool,
  culture: PropTypes.string
}

export default SmartComponent({
  value: (a, b) => a.getTime() === b.getTime(),
  resources: (a, b, props) => a.reduce((result, aResource) => b.some((bResource) => get(bResource, props.accessors.resource.id) === get(aResource, props.accessors.resource.id)) ? result : false, true)
})(TimeSlotGroup)
