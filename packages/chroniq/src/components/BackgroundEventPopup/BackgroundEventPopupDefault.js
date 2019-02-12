import React from 'react'

export default class BackgroundEventPopupDefault extends React.PureComponent {
  render () {
    return (
      <div ref={this.props.onRef} className='chrnq-event-popup'>
        {
          (this.props.title) && <span><b>Title: </b>{this.props.title}</span>
        }
      </div>
    )
  }
}
