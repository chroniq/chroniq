import { get, set } from '@chroniq/chroniq-accessor-helpers'

import { DEFAULT_RESOURCE_ID } from './resource'

// export const prepareEvents = (events, accessors, mutators) => {
//   let mutator = mutators.resourceId
//   return events.map((event) => {
//     let resourceId = getResourceId(event, accessors)
//     let maybeEvent = set(event, resourceId, mutator)
//     return maybeEvent || event
//   })
// }

const getResourceId = (event, accessors) => {
  let resourceId = get(event, accessors.resourceId)
  return typeof resourceId === 'undefined' ? DEFAULT_RESOURCE_ID : resourceId
}

export const prepareEvents = (events, accessors, mutators) => {
  let allEvents = []
  events.forEach((event) => {
    if (Array.isArray(event.resourceId)) {
      const resourceIdArray = event.resourceId
      resourceIdArray.forEach((resourceId, index) => {
        allEvents.push({
          ...event,
          resourceId: resourceId
        })
      })
    } else {
      allEvents.push(event)
    }
  })
  return allEvents
}
