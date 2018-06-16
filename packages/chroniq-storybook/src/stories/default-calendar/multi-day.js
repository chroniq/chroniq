import React from 'react'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <Chroniq
  date={new Date(2016, 11, 4)}
  events={[
    {
      id: 1,
      title: 'start of the week',
      start: new Date(2016, 11, 4, 15),
      end: new Date(2016, 11, 5, 3)
    },
    {
      id: 2,
      title: 'end of the week',
      start: new Date(2016, 11, 3),
      end: new Date(2016, 11, 3)
    },
    {
      id: 3,
      title: 'middle',
      start: new Date(2016, 11, 6),
      end: new Date(2016, 11, 6)
    }
  ]}
/>
