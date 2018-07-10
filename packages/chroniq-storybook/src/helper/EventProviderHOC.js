import React from 'react'
import createEvents from '../utils/createEvents'
const events = createEvents()

export default class EventProviderHOC extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      events: this.props.resourceCount
        ? events.map((event, index) => ({ ...event, resourceId: index % this.props.resourceCount }))
        : events
    }
  }

  updateEvents = (newData) => {
    if (!newData) {
      return
    }

    this.setState((prevState) => ({
      events: prevState.events.map((event) => {
        const newEvent = newData.find((newData) => newData.id === event.id)

        return newEvent
          ? {
            ...event,
            start: newEvent.start,
            end: newEvent.end,
            resourceId: typeof newEvent.resourceId !== 'undefined' ? newEvent.resourceId : event.resourceId
          }
          : event
      })
    }))
  }

  render () {
    let { onEventDrop, onEventResize } = this.props.children.props
    return React.cloneElement(
      React.Children.only(this.props.children),
      {
        events: this.state.events,
        onEventDrop: (newData) => {
          Promise.resolve(onEventDrop && onEventDrop(newData)).then(() => {
            this.updateEvents(newData)
          })
        },
        onEventResize: (newData) => {
          Promise.resolve(onEventResize && onEventResize(newData)).then(() => {
            this.updateEvents(newData)
          })
        }
      }
    )
  }
}
