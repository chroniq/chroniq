import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import { action } from '@storybook/addon-actions'
import Chroniq from '@chroniq/chroniq/lib'
import moment from 'moment'
import EventProviderHOC from '../../helper/EventProviderHOC'

import 'moment/locale/de.js'

moment.locale('de')

const businessHours = [{
  days: [1, 2, 3, 4, 5],
  from: '08:00',
  to: '12:00'
}, {
  days: [1, 2, 4, 5],
  from: '13:00',
  to: '17:00'
}]

const events = []
const backgroundEvents = [{
  id: 1,
  start: moment().startOf('day').toDate(),
  end: moment().endOf('day').toDate()
}]

moment.locale('de')

const DefaultView = () => <EventProviderHOC>
  <Chroniq
    view='week'
    culture='de'
    backgroundEvents={backgroundEvents}
    businessHours={businessHours}
    onSelectEvent={action('event selected')}
    date={new Date()}
  />
</EventProviderHOC>

export default compose(
  withNotes('Boom')
)(DefaultView)
