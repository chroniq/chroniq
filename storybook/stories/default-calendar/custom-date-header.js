import React from 'react'
import Chroniq from '@chroniq/chroniq/lib'
import createEvents from '../../utils/createEvents.js'

const events = createEvents()
const components = {
  month: {
    dateHeader: ({ label }) => <span>{label} - Custom date header</span>
  }
}

export default () => <Chroniq
  defaultView={Chroniq.Views.MONTH}
  events={events}
  components={components}
/>
