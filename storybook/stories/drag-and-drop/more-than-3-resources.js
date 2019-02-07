import React from 'react'
import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <EventProviderHOC resourceCount={4}>
  <Chroniq
    popup
    selectable
    withDragAndDrop
    resources={[
      {
        title: 'User A',
        id: 0
      }, {
        title: 'User B',
        id: 1
      }, {
        title: 'User C',
        id: 2
      }, {
        title: 'User D',
        id: 3
      }
    ]}
    onSelectEvent={action('event selected')}
    onEventDrop={action('event dropped')}
    onEventResize={action('event resized')}
    date={new Date()}
    joinedResources={[ 0, 1, 2 ]}
  />
</EventProviderHOC>
