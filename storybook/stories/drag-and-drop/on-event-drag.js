import React from 'react'
import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <EventProviderHOC>
  <Chroniq
    popup
    selectable
    withDragAndDrop
    onEventDrag={action('onEventDrag')}
    onSelectEvent={action('event selected (IDs of selected events)')}
    onEventDrop={action('event dropped')}
    onEventResize={action('event resized')}
    defaultDate={new Date()}
  />
</EventProviderHOC>
