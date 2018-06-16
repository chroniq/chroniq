import React from 'react'
import { action } from '@storybook/addon-actions'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import createEvents from '../../utils/createEvents.js'

const events = createEvents()

export default () => <Chroniq
  defaultView='week'
  selectable
  slotInterval={3}
  minTime={moment('12:00am', 'h:mma').toDate()}
  maxTime={moment('11:59pm', 'h:mma').toDate()}
  events={events}
  onSelectEvent={action('event selected')}
  onSelectSlot={action('slot selected')}
  date={new Date()}
/>
