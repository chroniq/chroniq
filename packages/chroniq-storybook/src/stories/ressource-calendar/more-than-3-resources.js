import React from 'react'
import { action } from '@storybook/addon-actions'
import moment from 'moment'
import uuid from 'uuid'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <Chroniq
  popup
  selectable
  events={events}
  resources={resources}
  onSelectEvent={action('event selected')}
  onEventDrop={action('event dropped')}
  onEventResize={action('event resized')}
  date={new Date()}
  // joinedResources={resources.map(res => res.id)}
/>

let resources = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  .map((char, index) => ({
    title: `User ${char}`,
    id: index
  }))

const events = resources.reduce((list, resource, i) => {
  const eventsPerResource = Array(7).fill(0).map(() => ({
    'id': uuid(),
    'title': `Event 1 for ${resource.title}`,
    'start': moment().startOf('month').add(i, 'day').toDate(),
    'end': moment().startOf('month').add(i, 'day').add(2, 'hour').toDate(),
    'resourceId': resource.id
  }))

  return list.concat(eventsPerResource)
}, [])
