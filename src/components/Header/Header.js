import PropTypes from 'prop-types'
import React from 'react'

class Header extends React.PureComponent {
  render () {
    return <span>{this.props.label}</span>
  }
}

Header.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ])
}

export default Header
