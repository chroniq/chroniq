import React from 'react'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <Chroniq
  date={new Date(2016, 11, 3)}
  events={[{
    id: 1,
    allDay: true,
    title: 'All Day Event',
    start: new Date(2016, 11, 3),
    end: new Date(2016, 11, 3)
  }]}
/>
