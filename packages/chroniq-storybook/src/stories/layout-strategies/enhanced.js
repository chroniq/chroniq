import React from 'react'
import moment from 'moment'
import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

import layoutStrategy from '@chroniq/chroniq-layout-strategy-enhanced'

export default () => <EventProviderHOC>
  <Chroniq
    popup
    selectable
    withDragAndDrop
    onSelectEvent={action('event selected (IDs of selected events)')}
    onEventDrop={action('event dropped')}
    onEventResize={action('event resized')}
    date={new Date()}
    view='day'
    backgroundEvents={[{
      id: 1,
      color: '#d63031',
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .hour(8)
        .minute(0)
        .toDate()
    }, {
      id: 2,
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .hour(5)
        .minute(0)
        .toDate()
    }, {
      id: 3,
      color: '#0984e3',
      start: moment()
        .hour(4)
        .minute(30)
        .toDate(),
      end: moment()
        .hour(22)
        .minute(0)
        .toDate()
    } ]}
    layoutStrategies={{
      events: layoutStrategy,
      backgroundEvents: layoutStrategy
    }}
  />
</EventProviderHOC>
