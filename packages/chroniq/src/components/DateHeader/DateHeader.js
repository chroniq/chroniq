import PropTypes from 'prop-types'
import React from 'react'

class DateHeader extends React.PureComponent {
  render () {
    return (
      <a href='#' onClick={this.props.onDrillDown}>
        {this.props.label}
      </a>
    )
  }
}

DateHeader.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  onDrillDown: PropTypes.func
}

export default DateHeader
