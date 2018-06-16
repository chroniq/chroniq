import { connect as reduxConnect } from 'react-redux'
import { STORE_KEY } from '../store'

export const connect = (mapStateToProps = null, mapDispatchToProps = null, mergeProps = null, options = {}) => (component) => {
  return reduxConnect(mapStateToProps, mapDispatchToProps, mergeProps, {
    areStatesEqual: (a, b) => a.get('props') === b.get('props'),
    ...options,
    storeKey: STORE_KEY
  })(component)
}
