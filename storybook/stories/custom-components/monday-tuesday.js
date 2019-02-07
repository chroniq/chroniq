import React from 'react'
import moment from 'moment'

import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'
import Week from '@chroniq/chroniq/lib/components/WorkWeek/WorkWeek'

const CustomWeek = (props) => <Week {...props} getRange={(date) => {
  return [
    moment(date).weekday(1).toDate(),
    moment(date).weekday(2).toDate()
  ]
}} />
CustomWeek.title = (date, { culture }) => {
  return 'I am the title'
}
CustomWeek.navigate = (date, action) => {
  switch (action) {
    case 'NAVIGATE_NEXT':
      return moment(date).add(1, 'week').toDate()
    case 'NAVIGATE_PREVIOUS':
      return moment(date).subtract(1, 'week').toDate()
    case 'NAVIGATE_TODAY':
      return new Date()
  }
}

CustomWeek.toString = () => 'Mo, Di'

export default () => <EventProviderHOC>
  <Chroniq
    popup
    selectable
    withDragAndDrop
    onSelectEvent={action('event selected')}
    onEventDrop={action('event dropped')}
    onEventResize={action('event resized')}
    defaultDate={new Date()}
    resources={[
      {
        title: 'Boom',
        id: 1
      },
      {
        title: 'Boom 2',
        id: 2
      }
    ]}
    views={[ 'week', 'month', CustomWeek ]}
    view={CustomWeek}
  />
</EventProviderHOC>
