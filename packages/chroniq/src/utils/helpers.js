import { default as cn } from 'classnames'
import { compose as _compose } from 'redux'

import { default as _difference } from 'lodash/difference'
import { default as _intersection } from 'lodash/intersection'
import { default as _each } from 'lodash/each'
import { default as _assign } from 'lodash/assign'
import { default as _omit } from 'lodash/omit'
import { default as _keys } from 'lodash/keys'
import { default as _defaults } from 'lodash/defaults'
import { default as _defaultsDeep } from 'lodash/defaultsDeep'
import { default as _transform } from 'lodash/transform'
import { default as _mapValues } from 'lodash/mapValues'
import { default as _range } from 'lodash/range'
import { default as _chunk } from 'lodash/chunk'
import { default as _findIndex } from 'lodash/findIndex'

import { default as _classes } from 'dom-helpers/class'
import { default as _events } from 'dom-helpers/events'

import { default as _getHeight } from 'dom-helpers/query/height'
import { default as _getWidth } from 'dom-helpers/query/width'
import { default as _getOffset } from 'dom-helpers/query/offset'
import { default as _getScrollTop } from 'dom-helpers/query/scrollTop'
import { default as _getScrollLeft } from 'dom-helpers/query/scrollLeft'
import { default as _contains } from 'dom-helpers/query/contains'
import { default as _closest } from 'dom-helpers/query/closest'
import { default as _getPosition } from 'dom-helpers/query/position'

import { default as _querySelectorAll } from 'dom-helpers/query/querySelectorAll'

import { default as _scrollbarSize } from 'dom-helpers/util/scrollbarSize'
import { default as _requestAnimationFrame } from 'dom-helpers/util/requestAnimationFrame'

export const difference = (...args) => {
  return _difference(...args)
}

export const intersection = (...args) => {
  return _intersection(...args)
}

export const each = (...args) => {
  return _each(...args)
}

export const assign = (...args) => {
  return _assign(...args)
}

export const omit = (...args) => {
  return _omit(...args)
}

export const keys = (...args) => {
  return _keys(...args)
}

export const defaults = (...args) => {
  return _defaults(...args)
}

export const defaultsDeep = (...args) => {
  return _defaultsDeep(...args)
}

export const transform = (...args) => {
  return _transform(...args)
}

export const mapValues = (...args) => {
  return _mapValues(...args)
}

export const range = (...args) => {
  return _range(...args)
}

export const chunk = (...args) => {
  return _chunk(...args)
}

export const findIndex = (...args) => {
  return _findIndex(...args)
}

export const classNames = (...args) => {
  return cn(...args)
}

export const compose = (...args) => {
  return _compose(...args)
}

export const classes = _classes

export const events = _events

export const getHeight = (...args) => {
  return _getHeight(...args)
}

export const getWidth = (...args) => {
  return _getWidth(...args)
}

export const getOffset = (...args) => {
  return _getOffset(...args)
}

export const getScrollTop = (...args) => {
  return _getScrollTop(...args)
}

export const getScrollLeft = (...args) => {
  return _getScrollLeft(...args)
}

export const contains = (...args) => {
  return _contains(...args)
}

export const closest = (...args) => {
  return _closest(...args)
}

export const getPosition = (...args) => {
  return _getPosition(...args)
}

export const querySelectorAll = (...args) => {
  return _querySelectorAll(...args)
}

export const scrollbarSize = (...args) => {
  return _scrollbarSize(...args)
}

export const requestAnimationFrame = (...args) => {
  return _requestAnimationFrame(...args)
}
