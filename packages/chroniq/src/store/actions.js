import dates from '../utils/dates'
import { get, toArray } from '@chroniq/chroniq-accessor-helpers'
import {
  getDate, getView, getViewNames, getViews, getSelectedEvents,
  getJoinedResources, getEvents
} from './selectors'

export const UPDATE_PROPS_ACTION = 'UPDATE_PROPS'
export const updateProps = (newProps) => ({
  type: UPDATE_PROPS_ACTION,
  payload: newProps
})

export const SELECT_EVENT_ACTION = 'SELECT_EVENT'
export const onSelectEvent = (event, accessors, mouseEvent) => {
  return {
    type: SELECT_EVENT_ACTION,
    payload: {
      eventId: get(event, accessors.id),
      resourceId: get(event, accessors.resourceId),
      optionsKey: mouseEvent.metaKey || mouseEvent.ctrlKey
    }
  }
}

export const DOUBLE_CLICK_EVENT_ACTION = 'DOUBLE_CLICK_EVENT'
export const onDoubleClickEvent = (event, accessors, mouseEvent) => {
  return {
    type: DOUBLE_CLICK_EVENT_ACTION,
    payload: {
      eventId: get(event, accessors.id),
      resourceId: get(event, accessors.resourceId)
    }
  }
}

export const SELECT_BACKGROUND_EVENT_ACTION = 'SELECT_BACKGROUND_EVENT'
export const onSelectBackgroundEvent = (event, accessors) => ({
  type: SELECT_BACKGROUND_EVENT_ACTION,
  payload: {
    eventId: get(event, accessors.id),
    resourceId: get(event, accessors.resourceId)
  }
})

export const OPEN_DRILLDOWN_VIEW_ACTION = 'OPEN_DRILLDOWN_VIEW'
export const openDrilldownView = (date) => ({
  type: OPEN_DRILLDOWN_VIEW_ACTION,
  payload: date
})

export const NAVIGATE_ACTION = 'NAVIGATE'
export const navigate = (target) => (dispatch, getState) => {
  const state = getState()
  const date = getDate(state)
  const view = getView(state)

  if (navigate.viewIsRegistered(view)) {
    dispatch({
      type: NAVIGATE_ACTION,
      payload: navigate.calculateNewDate(view, date, target)
    })

    return
  }

  switch (target) {
    case navigate.TODAY:
      dispatch({
        type: NAVIGATE_ACTION,
        payload: new Date()
      })
      break

    case navigate.PREVIOUS:
      dispatch({
        type: NAVIGATE_ACTION,
        payload: dates.add(date, -1, view)
      })
      break

    case navigate.NEXT:
      dispatch({
        type: NAVIGATE_ACTION,
        payload: dates.add(date, 1, view)
      })
      break

    default:
      dispatch({
        type: NAVIGATE_ACTION,
        payload: target
      })
  }
}
navigate.TODAY = 'NAVIGATE_TODAY'
navigate.PREVIOUS = 'NAVIGATE_PREVIOUS'
navigate.NEXT = 'NAVIGATE_NEXT'

navigate.registeredViews = {}
navigate.registerView = (view, func) => { navigate.registeredViews[view] = func }
navigate.viewIsRegistered = (view) => navigate.registeredViews.hasOwnProperty(view)
navigate.calculateNewDate = (view, date, action) => navigate.registeredViews[view].call(null, date, action)

export const SET_VIEW_ACTION = 'SET_VIEW'
export const setViewByName = (viewName) => (dispatch, getState) => {
  const state = getState()
  const viewNames = getViewNames(state)
  const views = getViews(state)

  dispatch({
    type: SET_VIEW_ACTION,
    payload: views[viewNames.findIndex((name) => name === viewName)].toString()
  })
}

export const SELECT_SLOT_ACTION = 'SELECT_SLOT'
export const onSelectSlot = (slotInfo) => {
  return ({
    type: SELECT_SLOT_ACTION,
    payload: slotInfo
  })
}

export const JOIN_RESOURCE_ACTION = 'JOIN_RESOURCE'
export const joinResource = (resourceId, accessors) => (dispatch, getState) => {
  const firstResourceId = get(
    toArray(getState().getIn([ 'props', 'resources' ]))[0],
    accessors.resource.id
  )

  dispatch({
    type: JOIN_RESOURCE_ACTION,
    payload: {
      resourceId,
      firstResourceId
    }
  })
}

export const SPLIT_RESOURCE_ACTION = 'SPLIT_RESOURCE'
export const splitResource = (resourceId) => {
  return ({
    type: SPLIT_RESOURCE_ACTION,
    payload: resourceId
  })
}

export const EVENT_DROP_ACTION = 'EVENT_DROP'
export const onEventDrop = (result) => {
  return {
    type: EVENT_DROP_ACTION,
    payload: result
  }
}

export const EVENT_DRAG_ACTION = 'EVENT_DRAG'
export const onEventDrag = (result) => {
  return {
    type: EVENT_DRAG_ACTION,
    payload: result
  }
}

export const EVENT_DRAG_BEGIN_ACTION = 'EVENT_DRAG_BEGIN'
export const onEventDragBegin = (data, accessors) =>
  (dispatch, getState) => {
    const state = getState()

    const events = getEvents(state)
    const selectedIds = getSelectedEvents(state)
    const joinedResources = getJoinedResources(state)

    const isSelected = selectedIds.includes(data.id)
    const isJoined = joinedResources.includes(data.resourceId)

    const selectedEvents = isSelected && events.filter(
      (event) => selectedIds.includes(get(event, accessors.event.id))
    )

    const multiResource = isSelected && (
      isJoined
        ? selectedEvents.some(
          (selectedEvent) => !joinedResources.includes(get(selectedEvent, accessors.event.resourceId))
        )
        : selectedEvents.some(
          (selectedEvent) => get(selectedEvent, accessors.event.resourceId) !== data.resourceId
        )
    )

    return dispatch({
      type: EVENT_DRAG_BEGIN_ACTION,
      payload: {
        ...data,
        multiResource
      }
    })
  }

export const EVENT_DRAG_OVER_CALENDAR_CHANGE_ACTION = 'EVENT_DRAG_OVER_CALENDAR_CHANGE'
export const setDragItemOverCalendar = (isOver) => {
  return {
    type: EVENT_DRAG_OVER_CALENDAR_CHANGE_ACTION,
    payload: isOver
  }
}

export const EVENT_RESIZE_BEGIN_ACTION = 'EVENT_RESIZE_BEGIN'
export const onEventResizeBegin = (data) => {
  return {
    type: EVENT_RESIZE_BEGIN_ACTION,
    payload: data
  }
}

export const EVENT_RESIZING_ACTION = 'EVENT_RESIZING'
export const onEventResizing = (result) => {
  return {
    type: EVENT_RESIZING_ACTION,
    payload: result
  }
}

export const EVENT_RESIZE_ACTION = 'EVENT_RESIZE'
export const onEventResize = (result) => {
  return {
    type: EVENT_RESIZE_ACTION,
    payload: result
  }
}

export const ACTIVATE_RESOURCE_ACTION = 'ACTIVATE_RESOURCE'
export const activateResource = (resourceId, append = false) => {
  return {
    type: ACTIVATE_RESOURCE_ACTION,
    payload: {
      resourceId,
      append
    }
  }
}

export const DEACTIVATE_RESOURCE_ACTION = 'DEACTIVATE_RESOURCE'
export const deactivateResource = (resourceId) => {
  return {
    type: DEACTIVATE_RESOURCE_ACTION,
    payload: {
      resourceId
    }
  }
}

export const ACTIVATE_ALL_RESOURCES_ACTION = 'ACTIVATE_ALL_RESOURCES'
export const activateAllResources = () => {
  return {
    type: ACTIVATE_ALL_RESOURCES_ACTION
  }
}
