import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer.js'
import thunk from 'redux-thunk'

export const STORE_KEY = 'CHRNQ-REDUX_STORE'

export const createStore = (middleware) => createReduxStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV === 'development'
  ? compose(
    applyMiddleware(thunk, middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  : applyMiddleware(thunk, middleware)
)
