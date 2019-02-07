export const createControllableActions = () => {
  const handlers = {}

  return {
    middleware: (store) => (next) => (action) => {
      if (handlers.hasOwnProperty(action.type) && handlers[action.type].intercept) {
        return handlers[action.type].callback.call(null, action.payload)
      }

      next(action)

      if (handlers.hasOwnProperty(action.type)) {
        const handler = handlers[action.type]

        if (typeof handler.selector === 'function') {
          return handler.callback.call(null, handler.selector(store.getState(), action))
        } else {
          return handler.callback.call(null, action.payload)
        }
      }
    },
    addActionHandlers: (actionTypes, callback, selector = false, intercept = false) => {
      actionTypes.forEach((actionType) => {
        handlers[actionType] = {
          callback,
          selector,
          intercept
        }
      })
    },
    removeActionHandlers: (actionTypes) => {
      actionTypes.forEach((actionType) => {
        delete handlers[actionType]
      })
    }
  }
}
