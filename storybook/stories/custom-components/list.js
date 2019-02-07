import React from 'react'
import moment from 'moment'

import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

class List extends React.Component {
  render () {
    return <p>Test</p>
  }
}

List.title = (date, { culture }) => {
  return `list of ${moment(date).format('YYYY')}`
}

List.navigate = (date, action) => {
  switch (action) {
    case 'NAVIGATE_NEXT':
      return moment(date).add(1, 'year').toDate()
    case 'NAVIGATE_PREVIOUS':
      return moment(date).subtract(1, 'year').toDate()
    case 'NAVIGATE_TODAY':
      return new Date()
  }
}

List.allowResources = false

List.toString = () => 'Liste'

export default () => <EventProviderHOC resourceCount={2}>
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
    views={[ 'week', 'month', List ]}
    view={List.toString()}
  />
</EventProviderHOC>
