import React from 'react'
import { createPortal } from 'react-dom'

export default class ToolbarContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = { isMounted: false }
  }

  componentDidMount () {
    this.setState({ isMounted: true })
  }

  render () {
    const toolbarTarget = this.props.toolbarTarget
    const children = this.props.children
    return (
      (toolbarTarget && this.state.isMounted) ? createPortal(children, document.querySelector(toolbarTarget)) : children
    )
  }
}
