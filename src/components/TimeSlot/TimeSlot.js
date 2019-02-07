import PropTypes from 'prop-types'
import React from 'react'

import { classNames } from '../../utils/helpers'

class TimeSlot extends React.PureComponent {
  render () {
    const {
      value,
      isLegend,
      resources,
      dayWrapperComponent: Wrapper,
      showLabel,
      content
    } = this.props

    const className = classNames({
      'chrnq-time-slot': true,
      'chrnq-label': !!this.props.showLabel,
      'chrnq-now': !!this.props.isNow
    })

    return (
      <Wrapper value={value} resources={resources} isLegend={isLegend}>
        <div className={className}>
          {
            showLabel && (
              <span>{content}</span>
            )
          }
        </div>
      </Wrapper>
    )
  }
}

TimeSlot.defaultProps = {
  isNow: false,
  showLabel: false,
  content: ''
}

TimeSlot.propTypes = {
  dayWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  value: PropTypes.instanceOf(Date).isRequired,
  resources: PropTypes.any,
  isNow: PropTypes.bool,
  showLabel: PropTypes.bool,
  isLegend: PropTypes.bool,
  content: PropTypes.string
}

export default TimeSlot
