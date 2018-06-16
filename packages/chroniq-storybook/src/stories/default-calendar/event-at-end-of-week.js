import React from 'react'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'

export default () => <Chroniq
  date={new Date(2016, 11, 3)}
  events={[
    {
      id: 1,
      title: 'has time',
      start: moment(new Date(2016, 11, 3)).add(1, 'days').subtract(5, 'hours').toDate(),
      end: moment(new Date(2016, 11, 3)).add(1, 'days').subtract(4, 'hours').toDate()
    }
  ]}
/>
