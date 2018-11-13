import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer.js'
import thunk from 'redux-thunk'

export const STORE_KEY = 'CHRNQ-REDUX_STORE'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const createStore = (middleware, preloadedStore) => createReduxStore(reducer, preloadedStore, process.env.NODE_ENV === 'development'
  ? composeEnhancers(
    applyMiddleware(thunk, middleware),
  )
  : applyMiddleware(thunk, middleware)
)
