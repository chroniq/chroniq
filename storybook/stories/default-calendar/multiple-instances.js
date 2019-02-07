import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import { action } from '@storybook/addon-actions'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC'

const DefaultView = () => (
  <div style={{
    display: 'flex',
    height: '100%'
  }}>
    <EventProviderHOC>
      <Chroniq
        key='1'
        popup
        selectable
        withDragAndDrop
        onSelectEvent={action('event selected')}
        onEventDrop={action('event dropped')}
        onEventResize={action('event resized')}
        defaultDate={new Date()}
      />
    </EventProviderHOC>
    <EventProviderHOC>
      <Chroniq key='2'
        popup
        selectable
        withDragAndDrop
        onSelectEvent={action('event selected')}
        onEventDrop={action('event dropped')}
        onEventResize={action('event resized')}
        defaultDate={new Date()}
      />
    </EventProviderHOC>

  </div>
)

export default compose(
  withNotes('Boom')
)(DefaultView)
