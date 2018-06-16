import { createSelector } from 'reselect'
import { inRange, sortEvents } from '../utils/eventLevels'
import { get } from '@chroniq/chroniq-accessor-helpers'

const getResources = (state, resources, accessors, range) => resources
const getRange = (state, resources, accessors, range) => range
const getAccessors = (state, resources, accessors, range) => accessors

const getBackgroundEvents = (state) => {
  return state.getIn([ 'props', 'backgroundEvents' ])
}

export const makeGetBackgroundEventsForResources = () => {
  return createSelector([
    getBackgroundEvents,
    getResources,
    (state, resources, accessors, range) => accessors
  ], (backgroundEvents, resources, accessors) => {
    return backgroundEvents
      .filter((bgEvent) => resources.some((resource) => get(bgEvent, accessors.backgroundEvent.resourceId) === get(resource, accessors.resource.id)))
  })
}

export const makeGetBackgroundEventsForResourcesAndRange = () => {
  const getBackgroundEventsForResources = makeGetBackgroundEventsForResources()

  return createSelector([
    getBackgroundEventsForResources,
    getRange,
    getAccessors
  ], (backgroundEvents, range, accessors) => {
    return backgroundEvents
      .filter(backgroundEvent => inRange(backgroundEvent, range[0], range[range.length - 1], accessors.backgroundEvent))
      .sort((a, b) => sortEvents(a, b, accessors.backgroundEvent))
  })
}
