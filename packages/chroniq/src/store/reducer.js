import { handleActions } from 'redux-actions'
import { List, Map } from 'immutable'
import { length, toArray } from '@chroniq/chroniq-accessor-helpers'
import dates from '../utils/dates.js'

import {
  UPDATE_PROPS_ACTION,
  SELECT_EVENT_ACTION,
  OPEN_DRILLDOWN_VIEW_ACTION,
  NAVIGATE_ACTION,
  SET_VIEW_ACTION,
  JOIN_RESOURCE_ACTION,
  SPLIT_RESOURCE_ACTION,
  ACTIVATE_RESOURCE_ACTION,
  DEACTIVATE_RESOURCE_ACTION,
  ACTIVATE_ALL_RESOURCES_ACTION,
  EVENT_DRAG_BEGIN_ACTION,
  EVENT_DRAG_ACTION,
  EVENT_DRAG_OVER_CALENDAR_CHANGE_ACTION,
  EVENT_DROP_ACTION,
  EVENT_RESIZE_BEGIN_ACTION,
  EVENT_RESIZING_ACTION,
  EVENT_RESIZE_ACTION
} from './actions.js'

import {
  getSelectedEvents,
  getJoinedResources
} from './selectors.js'

const onSelectEvent = (state, action) => {
  if (action.payload.optionsKey) {
    if (state.getIn([ 'props', 'selectedEvents' ], List()).includes(action.payload.eventId)) { // event already was selected
      return state.updateIn(
        [ 'props', 'selectedEvents' ],
        List(),
        (selectedEvents) => selectedEvents.filter((id) => id !== action.payload.eventId)
      )
    } else {
      return state.updateIn(
        [ 'props', 'selectedEvents' ],
        List(),
        (selectedEvents) => selectedEvents.concat(action.payload.eventId)
      )
    }
  } else {
    if (state.getIn([ 'props', 'selectedEvents' ], List()).size > 1) {
      return state.setIn([ 'props', 'selectedEvents' ], List([ action.payload.eventId ]))
    } else {
      return state.updateIn(
        [ 'props', 'selectedEvents' ],
        List(),
        (selectedEvents) => selectedEvents.includes(action.payload.eventId)
          ? List()
          : List([ action.payload.eventId ])
      )
    }
  }
}

const onUpdateProps = (state, action) => {
  return state.update(
    'props',
    Map(),
    (oldProps) => oldProps.mergeDeep(action.payload)
  )
}

const onOpenDrillDownView = (state, action) => {
  return state
    .setIn([ 'props', 'view' ], 'day')
    .setIn([ 'props', 'date' ], action.payload)
}

const onDateChange = (state, action) => {
  return state.setIn([ 'props', 'date' ], action.payload)
}

const onViewChange = (state, action) => {
  return state.setIn([ 'props', 'view' ], action.payload)
}

const onSplitResource = (state, action) => {
  state = state.updateIn([ 'props', 'joinedResources' ], [], (oldValue) => length(oldValue) > 2
    ? oldValue.filter((resourceId) => resourceId !== action.payload)
    : []
  )

  if (state.getIn([ 'props', 'joinedResources' ]).length === 0) {
    state = state.setIn([ 'props', 'activeResources' ], List())
  } else {
    state = state.updateIn(
      [ 'props', 'activeResources' ],
      List(),
      (activeResources) => {
        const result = activeResources && activeResources.filter((resourceId) => resourceId !== action.payload)

        return (result && result.size > 0)
          ? result
          : null
      }
    )
  }

  return state
}

const onJoinResource = (state, action) => {
  return state.updateIn([ 'props', 'joinedResources' ], [], (oldValue) => {
    const { resourceId } = action.payload

    if (length(oldValue) === 0) {
      const { firstResourceId } = action.payload

      if (firstResourceId !== resourceId) {
        return [ firstResourceId, resourceId ]
      }

      return oldValue
    } else {
      return oldValue.includes(resourceId) ? oldValue : oldValue.concat(resourceId)
    }
  })
}

const activateResource = (state, action) => {
  return state.updateIn([ 'props', 'activeResources' ], List(), (activeResources) => {
    if (action.payload.append) {
      if (activeResources === null) {
        activeResources = List()
      }

      return activeResources.includes(action.payload.resourceId)
        ? activeResources
        : activeResources.concat(action.payload.resourceId)
    } else {
      return List([ action.payload.resourceId ])
    }
  })
}

const deactivateResource = (state, action) => {
  return state.updateIn([ 'props', 'activeResources' ], (activeResources) => activeResources.filter((resourceId) => resourceId !== action.payload.resourceId))
}

const activateAllResources = (state) => {
  return state.setIn([ 'props', 'activeResources' ], null)
}

const onEventDragBegin = (state, action) => {
  state = state
    .setIn([ 'dnd', 'isDragging' ], true)
    .setIn([ 'dnd', 'draggedEvent' ], Map({
      id: action.payload.id,
      start: action.payload.start,
      end: action.payload.end,
      resourceId: action.payload.resourceId
    }))
    .setIn([ 'dnd', 'startOffset' ], 0)
    .setIn([ 'dnd', 'endOffset' ], 0)
    .setIn([ 'dnd', 'resourceId' ], action.payload.resourceId)
    .setIn([ 'dnd', 'multiResource' ], action.payload.multiResource)

  const selectedIds = getSelectedEvents(state)

  if (selectedIds.size > 1 && selectedIds.includes(state.getIn([ 'dnd', 'draggedEvent', 'id' ]))) {
    state = state.setIn(
      [ 'dnd', 'previews' ],
      selectedIds
    )
  } else {
    state = state.setIn(
      [ 'dnd', 'previews' ],
      List([ action.payload.id ])
    )
  }

  return state
}

const onEventDrag = (state, action) => {
  const startOffset = dates.diff(
    state.getIn([ 'dnd', 'draggedEvent', 'start' ]),
    action.payload.start,
    'minutes'
  ) * (state.getIn([ 'dnd', 'draggedEvent', 'start' ]) > action.payload.start ? -1 : 1)
  const endOffset = dates.diff(
    state.getIn([ 'dnd', 'draggedEvent', 'end' ]),
    action.payload.end,
    'minutes'
  ) * (state.getIn([ 'dnd', 'draggedEvent', 'end' ]) > action.payload.end ? -1 : 1)

  return state
    .setIn(
      [ 'dnd', 'startOffset' ],
      startOffset
    )
    .setIn(
      [ 'dnd', 'endOffset' ],
      endOffset
    )
    .setIn(
      [ 'dnd', 'resourceId' ],
      action.payload.resourceId === 'multiple'
        ? state.getIn([ 'dnd', 'draggedEvent', 'resourceId' ])
        : typeof action.payload.resourceId === 'undefined'
          ? state.getIn([ 'dnd', 'resourceId' ])
          : action.payload.resourceId
    )
}

const onEventDragChangeIsOver = (state, action) => state.updateIn(
  [ 'dnd', 'isOver' ],
  0,
  (currentValue) => currentValue + (action.payload ? 1 : -1)
)

const onEventDrop = (state, action) => state.setIn([ 'dnd', 'isDragging' ], false)

const getDefaultState = () => Map()

export default handleActions({
  [UPDATE_PROPS_ACTION]: onUpdateProps,
  [SELECT_EVENT_ACTION]: onSelectEvent,
  [OPEN_DRILLDOWN_VIEW_ACTION]: onOpenDrillDownView,
  [NAVIGATE_ACTION]: onDateChange,
  [SET_VIEW_ACTION]: onViewChange,
  [JOIN_RESOURCE_ACTION]: onJoinResource,
  [SPLIT_RESOURCE_ACTION]: onSplitResource,
  [ACTIVATE_RESOURCE_ACTION]: activateResource,
  [DEACTIVATE_RESOURCE_ACTION]: deactivateResource,
  [ACTIVATE_ALL_RESOURCES_ACTION]: activateAllResources,
  [EVENT_DRAG_BEGIN_ACTION]: onEventDragBegin,
  [EVENT_DRAG_ACTION]: onEventDrag,
  [EVENT_DRAG_OVER_CALENDAR_CHANGE_ACTION]: onEventDragChangeIsOver,
  [EVENT_DROP_ACTION]: onEventDrop,
  [EVENT_RESIZE_BEGIN_ACTION]: onEventDragBegin,
  [EVENT_RESIZING_ACTION]: onEventDrag,
  [EVENT_RESIZE_ACTION]: onEventDrop
}, getDefaultState())
