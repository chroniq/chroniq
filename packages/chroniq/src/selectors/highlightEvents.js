import { createSelector } from 'reselect'
import { List } from 'immutable'

import dates from '../utils/dates'
import { inRange, sortEvents } from '../utils/eventLevels'
import { get, length } from '@chroniq/chroniq-accessor-helpers'

import { getEvents, getSlotDuration, isDragging } from '../store/selectors'

const getResources = (state, resources, accessors, range) => resources
const getRange = (state, resources, accessors, range) => range
const getAccessors = (state, resources, accessors, range) => accessors

const getHighlightEventIds = (state) => isDragging(state)
  ? state.getIn([ 'dnd', 'previews' ], List())
  : List()

const getStartOffset = (state) => state.getIn([ 'dnd', 'startOffset' ], 0)
const getEndOffset = (state) => state.getIn([ 'dnd', 'endOffset' ], 0)
const getDraggedResourceId = (state) => state.getIn([ 'dnd', 'resourceId' ])
const getOriginalResourceId = (state) => state.getIn([ 'dnd', 'draggedEvent', 'resourceId' ], null)

const makeGetHighlightEvents = () => {
  return createSelector([
    getEvents,
    getHighlightEventIds,
    getAccessors,
    getStartOffset,
    getEndOffset,
    getDraggedResourceId,
    getOriginalResourceId,
    getSlotDuration
  ], (events, highlightEventIds, accessors, startOffset, endOffset, resourceId, originalResourceId, slotDuration) => {
    return events
      .filter((event) => highlightEventIds.includes(get(event, accessors.event.id)))
      .map((event) => {
        const from = dates.add(get(event, accessors.event.start), startOffset, 'minutes')
        const to = dates.add(get(event, accessors.event.end), endOffset, 'minutes')

        return {
          id: get(event, accessors.event.id),
          from,
          to: from < to ? to : dates.add(from, slotDuration, 'minutes'),
          resourceId: resourceId === originalResourceId ? get(event, accessors.event.resourceId) : resourceId
        }
      })
  })
}

export const makeGetHighlightEventsForResources = () => {
  const getHighlightEvents = makeGetHighlightEvents()

  return createSelector([
    getHighlightEvents,
    getResources,
    getAccessors
  ], (highlightEvents, resources, accessors) => {
    return highlightEvents
      .filter((event) => resources.some((resource) => event.resourceId === get(resource, accessors.resource.id)))
  })
}

export const makeGetHighlightEventsForResourcesAndRange = () => {
  const getHighlightEventsForResources = makeGetHighlightEventsForResources()

  return createSelector([
    getHighlightEventsForResources,
    getRange,
    getAccessors
  ], (highlightEvents, range, accessors) => {
    return highlightEvents
      .filter(event => inRange(event, range[0], range[range.length - 1], accessors.highlightEvent))
      .sort((a, b) => sortEvents(a, b, accessors.highlightEvent))
  })
}

const getMultipleResourceFlag = (state) => state.getIn([ 'dnd', 'multiResource' ])
export const makeCanDrop = () => {
  return createSelector([
    getOriginalResourceId,
    getMultipleResourceFlag,
    getResources,
    getAccessors
  ], (resourceId, multiResource, resources, accessors) => resourceId !== null && (
    (!multiResource && length(resources) === 1) ||
    resources.some((resource) => get(resource, accessors.resource.id) === resourceId)
  ))
}
