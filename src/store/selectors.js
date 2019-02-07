import { createSelector } from 'reselect'
import { List } from 'immutable'
import { get } from '../accessors'
import dates from '../utils/dates'

const getPropDate = (_, date) => date
const getEventId = (state, accessors, event) => get(event, accessors.event.id)
const getEventResourceId = (state, accessors, event) => get(event, accessors.event.resourceId)

export const getEvents = (state) => state.getIn([ 'props', 'events' ])

export const isDragging = (state) => state.getIn([ 'dnd', 'isDragging' ], false)

export const isDragInside = (state) => state.getIn([ 'dnd', 'isOver' ], false) > 0

export const getSelectedEvents = (state) => {
  const selectedEventsIds = state.getIn([ 'props', 'selectedEvents' ], List())
  const allEvents = state.getIn([ 'props', 'events' ])
  let selectedEvents = []
  allEvents.forEach(event => {
    selectedEventsIds.forEach(eventId => (eventId === event.id) ? selectedEvents.push(event) : null)
  })
  return selectedEvents
}

export const makeIsSelected = () => {
  return createSelector([
    getSelectedEvents,
    getEventId
  ], (selectedEvents, eventId) => !selectedEvents.every((selected) => selected.id !== eventId))
}

export const makeGetSelectedEvents = () => {
  return createSelector([
    getSelectedEvents,
    getEvents
  ], (selectedIds, events, accessors) => events.filter((event) => selectedIds.includes(get(event, accessors.event.id))))
}

export const getDate = (state) => {
  return state.getIn([ 'props', 'date' ])
}

export const getSlotDuration = (state) => {
  return state.getIn([ 'props', 'slotDuration' ])
}

export const getSlotInterval = (state) => {
  return state.getIn([ 'props', 'slotInterval' ])
}

export const getDayFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'dayFormat' ])
}

export const getDateFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'dateFormat' ])
}

export const getWeekdayFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'weekdayFormat' ])
}

export const getAgendaDateFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'agendaDateFormat' ])
}

export const getAgendaTimeFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'agendaTimeFormat' ])
}

export const getAgendaTimeRangeFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'agendaTimeRangeFormat' ])
}

export const getEventTimeRangeFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'eventTimeRangeFormat' ])
}

export const getEventTimeRangeStartFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'eventTimeRangeStartFormat' ])
}

export const getEventTimeRangeEndFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'eventTimeRangeEndFormat' ])
}

export const getTimeGutterFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'timeGutterFormat' ])
}

export const getSelectRangeFormat = (state) => {
  return state.getIn([ 'props', 'formats', 'selectRangeFormat' ])
}

export const getCulture = (state) => {
  return state.getIn([ 'props', 'culture' ])
}

export const getRtl = (state) => {
  return state.getIn([ 'props', 'rtl' ])
}

export const getMessages = (state) => {
  return state.getIn([ 'props', 'messages' ])
}

export const getRealMinTime = (state) => state.getIn([ 'props', 'minTime' ])
export const makeGetMinTime = () =>
  createSelector([
    getRealMinTime,
    getPropDate
  ], (minTime, date) => {
    return dates.merge(date, minTime)
  })

export const getRealMaxTime = (state) => state.getIn([ 'props', 'maxTime' ])
export const makeGetMaxTime = () =>
  createSelector([
    getRealMaxTime,
    getPropDate
  ], (maxTime, date) => {
    return dates.merge(date, maxTime)
  })

export const getPopup = (state) => {
  return state.getIn([ 'props', 'popup' ])
}

export const getView = (state) => {
  return state.getIn([ 'props', 'view' ])
}

export const getViewNames = (state) => {
  return state.getIn([ 'props', 'names' ])
}

const defaultScrollTime = dates.startOf(new Date(), 'day')
export const getScrollTime = (state) => {
  return state.getIn(['props', 'scrollTime'], defaultScrollTime)
}

export const getViews = (state) => {
  return state.getIn([ 'props', 'views' ])
}

export const getSelectable = (state) => {
  return state.getIn([ 'props', 'selectable' ])
}

export const getJoinedResources = (state) => {
  return state.getIn([ 'props', 'joinedResources' ])
}

export const getActiveResources = (state) => {
  return state.getIn([ 'props', 'activeResources' ], null)
}

const makeIsPinnedEvent = () =>
  createSelector([
    getJoinedResources,
    getEventResourceId
  ], (pinnedResources, eventResourceId) => pinnedResources.includes(eventResourceId))

export const makeIsDeactivated = () =>
  createSelector([
    makeIsPinnedEvent(),
    getActiveResources,
    getEventResourceId
  ], (isPinned, activeResources, eventResourceId) => {
    return isPinned && activeResources !== null && activeResources.size > 0 && !activeResources.includes(eventResourceId)
  })

export const getSnapDuration = (state) => {
  return state.getIn([ 'props', 'snapDuration' ]) || getSlotDuration(state)
}
