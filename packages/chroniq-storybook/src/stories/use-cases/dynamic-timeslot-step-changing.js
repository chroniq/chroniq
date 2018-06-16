import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import { action } from '@storybook/addon-actions'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC.js'

class DefaultView extends React.PureComponent {
  state = {
    slotDuration: 15,
    slotInterval: 4
  }
  onEventDragBegin = () => {
    this.setState({
      slotDuration: 30,
      slotInterval: 4
    })
  }
  onEventDrop = () => {
    this.setState({
      slotDuration: 15,
      slotInterval: 4
    })
  }
  render () {
    return (<EventProviderHOC>
      <Chroniq
        popup
        selectable
        view={'week'}
        withDragAndDrops
        slotDuration={this.state.slotDuration}
        slotInterval={this.state.slotInterval}
        onSelectEvent={action('event selected (IDs of selected events)')}
        onEventDrop={this.onEventDrop}
        onEventDragBegin={this.onEventDragBegin}
        onEventResize={action('event resized')}
        defaultDate={new Date()}
      />
    </EventProviderHOC>
    )
  }
}

export default compose(
  withNotes('Boom')
)(() => <DefaultView />)
