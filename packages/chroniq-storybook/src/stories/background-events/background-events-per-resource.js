import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import { action } from '@storybook/addon-actions'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC'
import createResourceEvents from '../../utils/createResourceEvents'

const { resources, events } = createResourceEvents()

const DefaultView = () => <EventProviderHOC>
  <Chroniq
    view='week'
    minTime={moment('12:00am', 'h:mma').toDate()}
    maxTime={moment('11:59pm', 'h:mma').toDate()}
    events={events}
    resources={resources}
    backgroundEvents={[{
      id: 1,
      resourceId: 1,
      color: '#d63031',
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .hour(8)
        .minute(0)
        .toDate()
    }, {
      id: 2,
      resourceId: 3,
      title: 'Boom',
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .hour(5)
        .minute(0)
        .toDate()
    }, {
      id: 3,
      resourceId: 1,
      start: moment()
        .hour(18)
        .minute(30)
        .toDate(),
      end: moment()
        .hour(22)
        .minute(0)
        .toDate()
    } ]}
    onSelectEvent={action('event selected')}
    date={new Date()}
  />
</EventProviderHOC>

export default compose(
  withNotes('Boom')
)(DefaultView)
