import React from 'react'
import moment from 'moment'
import { fromJS } from 'immutable'
import Chroniq from '@chroniq/chroniq/lib'

import { accessors, mutators } from '@chroniq/chroniq/lib/accessors/immutable'

const events = fromJS([
  {
    id: 1,
    resourceId: 1,
    title: 'Test 1',
    start: moment().toDate(),
    end: moment().add(2, 'hour').toDate()
  },
  {
    id: 1,
    resourceId: 2,
    title: 'Test 2',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(2, 'hour').toDate()
  }
])

const resources = [
  {
    id: 1,
    title: 'Incoqnito'
  },
  {
    id: 2,
    title: 'Medsolv'
  }
]

const mixedAccessors = {
  event: accessors.event
}

const mixedMutators = {
  event: mutators.event
}

export default () => <Chroniq
  popup
  selectable
  withDragAndDrop
  events={events}
  resources={resources}
  accessors={mixedAccessors}
  mutators={mixedMutators}
/>
