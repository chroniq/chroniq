import React from 'react'
import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

class Story extends React.PureComponent {
  state = {
    snapDuration: 10
  }

  onEventDrag = (event) => {
    const eventDuration = (event.end - event.start) / 1000 / 60

    this.setState({
      snapDuration: eventDuration
    })
  }

  render () {
    return (
      <EventProviderHOC>
        <Chroniq
          popup
          selectable
          withDragAndDrop
          snapDuration={this.state.snapDuration}
          onSelectEvent={action('event selected (IDs of selected events)')}
          onEventDragBegin={this.onEventDrag}
          onEventDrop={action('event dropped')}
          onEventResize={action('event resized')}
          defaultDate={new Date()}
        />
      </EventProviderHOC>
    )
  }
}

export default () => <Story />
