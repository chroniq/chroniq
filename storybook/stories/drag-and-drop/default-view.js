import React from 'react'
import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <EventProviderHOC>
  <Chroniq
    popup
    selectable
    withDragAndDrop
    onSelectEvent={action('event selected (IDs of selected events)')}
    onEventDrop={action('event dropped')}
    onEventResize={action('event resized')}
    onEventResizeBegin={action('events onResizeBegin')}
    defaultDate={new Date()}
  />
</EventProviderHOC>
