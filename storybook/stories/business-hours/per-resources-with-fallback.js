import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import { action } from '@storybook/addon-actions'
import Chroniq from '@chroniq/chroniq/lib'
import moment from 'moment'

import 'moment/locale/de.js'

moment.locale('de')

const businessHours = [{
  days: [1, 2, 3, 4, 5],
  from: '08:00',
  to: '16:00'
}]

let resources = [{
  id: 1,
  title: 'Christian Birg',
  businessHours: [{
    days: [1, 2, 3, 4, 5],
    from: '08:00',
    to: '12:00'
  }, {
    days: [1, 2, 4, 5],
    from: '13:00',
    to: '17:00'
  }]
}, {
  id: 2,
  title: 'Patrick Flöter',
  businessHours: [{
    days: [ 2, 4 ],
    from: '08:00',
    to: '12:00'
  }, {
    days: [1, 3, 5],
    from: '13:00',
    to: '17:00'
  }]
}, {
  id: 3,
  title: 'Marces Engel'
}]

const events = []
const backgroundEvents = []

moment.locale('de')

const DefaultView = () => <Chroniq
  view='week'
  culture='de'
  events={events}
  resources={resources}
  backgroundEvents={backgroundEvents}
  businessHours={businessHours}
  joinedResources={[1, 2]}
  onSelectEvent={action('event selected')}
  date={new Date()}
/>

export default compose(
  withNotes('Boom')
)(DefaultView)
