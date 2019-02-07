import React from 'react'
import PropTypes from 'prop-types'

class BackgroundWrapper extends React.PureComponent {
  render () {
    return this.props.children
  }
}

BackgroundWrapper.propTypes = {

  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ])
}

export default BackgroundWrapper
