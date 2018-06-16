import { List } from 'immutable'

const isImmutable = (maybeImmutable) => !!maybeImmutable.toJS

export function get (data, accessor) {
  if (typeof accessor === 'function') {
    return accessor(data)
  }

  if (typeof accessor === 'string' && typeof data === 'object' && data != null && accessor in data) {
    return data[accessor]
  }

  return undefined
}

export function set (data, value, mutator) {
  if (isImmutable(data)) {
    return mutator(data, value)
  }

  if (typeof mutator === 'function') {
    mutator(data, value)
  }

  if (typeof mutator === 'string' && typeof data === 'object' && data != null) {
    data[mutator] = value
  }

  return null
}

export function length (collection) {
  if (!collection) {
    return false
  }

  if (collection.hasOwnProperty('length')) {
    return collection.length
  }

  if (List.isList(collection)) {
    return collection.size
  }

  return false
}

export function toArray (collection) {
  return Array.isArray(collection) ? collection : collection.toArray()
}
