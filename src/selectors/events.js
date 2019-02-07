import { createSelector } from 'reselect'
import { inRange, sortEvents } from '../utils/eventLevels'
import { get } from '../accessors'

import { getEvents } from '../store/selectors'

const getResources = (state, resources, accessors, range) => resources
const getRange = (state, resources, accessors, range) => range
const getAccessors = (state, resources, accessors, range) => accessors

export const makeGetEventsForResources = () => {
  return createSelector([
    getEvents,
    getResources,
    getAccessors
  ], (events, resources, accessors) => {
    return events
      .filter(event => resources.some((resource) => get(event, accessors.event.resourceId) === get(resource, accessors.resource.id)))
  })
}

export const makeGetEventsForResourcesAndRange = () => {
  const getEventsForResources = makeGetEventsForResources()

  return createSelector([
    getEventsForResources,
    getRange,
    getAccessors
  ], (events, range, accessors) => {
    return events
      .filter(event => inRange(event, range[0], range[range.length - 1], accessors.event))
      .sort((a, b) => sortEvents(a, b, accessors.event))
  })
}
