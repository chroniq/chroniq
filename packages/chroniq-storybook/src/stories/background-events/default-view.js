import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import { action } from '@storybook/addon-actions'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC.js'

const DefaultView = () =>
  <Chroniq
    view='week'
    minTime={moment('12:00am', 'h:mma').toDate()}
    maxTime={moment('11:59pm', 'h:mma').toDate()}
    backgroundEvents={[ {
      id: 0,
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .add(1, 'day')
        .hour(8)
        .minute(0)
        .toDate()
    }]}
    events={[]}
    onSelectEvent={action('event selected')}
    date={new Date()}
  />
  

export default compose(
  withNotes('Boom')
)(DefaultView)
