import React from 'react'
import PropTypes from 'prop-types'

class EventWrapper extends React.PureComponent {
  render () {
    return this.props.children
  }
}

EventWrapper.propTypes = {

  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ])
}

export default EventWrapper
