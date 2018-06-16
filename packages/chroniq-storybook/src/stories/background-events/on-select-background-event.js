import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import { action } from '@storybook/addon-actions'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC'

const DefaultView = () => <EventProviderHOC>
  <Chroniq
    view='week'
    backgroundEvents={[ {
      id: 0,
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .hour(8)
        .minute(0)
        .toDate()
    }, {
      id: 1,
      start: moment()
        .hour(18)
        .minute(30)
        .toDate(),
      end: moment()
        .hour(22)
        .minute(0)
        .toDate()
    } ]}
    onSelectBackgroundEvent={action('background event selected')}
    date={new Date()}
  />
</EventProviderHOC>

export default compose(
  withNotes('Boom')
)(DefaultView)
