import React from 'react'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import createEvents from '../../utils/createEvents.js'

const events = createEvents()

export default () => <Chroniq
  defaultView={Chroniq.Views.DAY}
  minTime={moment('8 am', 'h a').toDate()}
  maxTime={moment('5 pm', 'h a').toDate()}
  events={events}
/>
