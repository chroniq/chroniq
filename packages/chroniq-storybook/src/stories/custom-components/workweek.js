import React from 'react'

import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'

import Chroniq from '@chroniq/chroniq/lib'
import WorkWeek from '@chroniq/chroniq-view-workweek'

export default () => <EventProviderHOC>
  <Chroniq
    popup
    selectable
    withDragAndDrop
    onSelectEvent={action('event selected')}
    onEventDrop={action('event dropped')}
    onEventResize={action('event resized')}
    defaultDate={new Date()}
    views={[ 'week', 'month', WorkWeek ]}
    view={WorkWeek}
  />
</EventProviderHOC>
