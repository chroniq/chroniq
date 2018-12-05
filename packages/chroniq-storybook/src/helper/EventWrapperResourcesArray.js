import React from 'react'
import moment from 'moment'

const events = [
  {
    id: 1,
    resourceId: [ 1, 2, 3 ],
    title: 'Combined Event 1',
    start: moment().toDate(),
    end: moment().add(2, 'hour').toDate()
  },
  {
    id: 2,
    resourceId: 2,
    title: 'Tim Event 2',
    start: moment().toDate(),
    end: moment().add(1, 'day').add(2, 'hour').toDate()
  },
  {
    id: 3,
    resourceId: 2,
    title: 'Tim Event 3',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(3, 'hour').toDate()
  },
  {
    id: 4,
    resourceId: 3,
    title: 'Oleksandr Event 4',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(4, 'hour').toDate()
  },
  {
    id: 5,
    resourceId: 4,
    title: 'Michael Event 5',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(5, 'hour').toDate()
  },
  {
    id: 6,
    resourceId: 1,
    title: 'David Event 6',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(6, 'hour').toDate()
  }
]

const resources = [
  {
    id: 1,
    title: 'Vivienne Thompson-Simmons'
  },
  {
    id: 2,
    title: 'Genevieve Washington-Henderson'
  },
  {
    id: 3,
    title: 'Charlotte Richardson'
  },
  {
    id: 4,
    title: 'Anastasia Anderson'
  }
]

export default class EventWrapper extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      events: events,
      resources: resources
    }
  }

  updateEvents = (newData) => {
    if (!newData) {
      return
    }

    this.setState((prevState) => ({
      events: prevState.events.map((event) => {
        const newEvent = newData.events.find((newData) => newData.id === event.id)
        return newEvent
          ? {
            ...event,
            start: newEvent.start,
            end: newEvent.end,
            resourceId: event.resourceId
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
        resources: this.state.resources,
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
