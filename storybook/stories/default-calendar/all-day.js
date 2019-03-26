import React from 'react'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <Chroniq
  date={new Date(2016, 11, 4)}
  events={[
    {
      id: 1,
      title: 'all night long',
      allDay: true,
      start: new Date(2016, 11, 4, 15),
      end: new Date(2016, 11, 4, 3)
    }
  ]}
/>
