import React from 'react'
import { action } from '@storybook/addon-actions'
import Chroniq from '@chroniq/chroniq/lib'
import createEvents from '../../utils/createEvents.js'

const events = createEvents()

export default () => <Chroniq
  defaultView='week'
  events={events}
  onDoubleClickEvent={action('double click event')}
  date={new Date()}
/>
