import { get, set } from '@chroniq/chroniq-accessor-helpers'

import { DEFAULT_RESOURCE_ID } from './resource'

const getResourceId = (event, accessors) => {
  let resourceId = get(event, accessors.resourceId)
  return typeof resourceId === 'undefined' ? DEFAULT_RESOURCE_ID : resourceId
}

export const prepareEvents = (events, accessors, mutators) => {
  let allEvents = []
  events.forEach((event) => {
    const resourceId = getResourceId(event, accessors)
    let tmpEvent = set(event, resourceId, mutators.resourceId)
    let opEvent = tmpEvent || event
    if (Array.isArray(resourceId)) {
      const resourceIdArray = opEvent.resourceId
      resourceIdArray.forEach((resourceId, index) => {
        allEvents.push({
          ...opEvent,
          resourceId
        })
      })
    } else {
      allEvents.push(event)
    }
  })
  return allEvents
}
