import React from 'react'
import moment from 'moment'
import 'jquery'
import 'underscore'
import Backbone from 'backbone'
import Chroniq from '@chroniq/chroniq/lib'
import { accessors, mutators } from '@chroniq/chroniq-accessors-immutable'

const Event = Backbone.Model.extend({
  defaults: {
    id: null,
    title: 'tietl',
    start: null,
    end: null
  }
})

const EventCollection = Backbone.Collection.extend({
  model: Event
})

const events = new EventCollection()

events.add(new Event({
  id: 1,
  resourceId: 1,
  title: 'Test 1',
  start: moment().toDate(),
  end: moment().add(2, 'hour').toDate()
}))

events.add(new Event({
  id: 2,
  resourceId: 2,
  title: 'Test 2',
  start: moment().add(1, 'day').toDate(),
  end: moment().add(1, 'day').add(2, 'hour').toDate()
}))

const Resource = Backbone.Model.extend({
  defaults: {
    id: null,
    title: 'tietl'
  }
})

const ResourceCollection = Backbone.Collection.extend({
  model: Resource
})

const resources = new ResourceCollection()

resources.add(new Resource({
  id: 1,
  title: 'Incoqnito'
}))

resources.add(new Resource({
  id: 2,
  title: 'Medsolv'
}))

export default () => <Chroniq
  popup
  selectable
  withDragAndDrop
  accessors={accessors}
  mutators={mutators}
  events={events}
  resources={resources}
/>
