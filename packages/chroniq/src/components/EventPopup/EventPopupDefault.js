import React from 'react'

export default class EventPopupDefault extends React.PureComponent {
  render () {
    return (
      <div ref={this.props.onRef} className='chrnq-event-popup'>
        <span><b>Title: </b>{this.props.event.title}</span>
        <span><b>Id: </b>{this.props.event.id}</span>
        <span><b>Start: </b>{this.props.event.start.toLocaleString()}</span>
        <span><b>End: </b>{this.props.event.end.toLocaleString()}</span>
        <span><b>ResourceId: </b>{this.props.event.resourceId}</span>
      </div>
    )
  }
}
