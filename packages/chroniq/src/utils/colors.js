import {
  readableColor,
  darken,
  lighten
} from 'polished'

export const getColorBy = (index) => {
  return colors[index % colors.length]
}

export const getReadableColor = (color) => {
  return readableColor(color)
}

export const getDarkenColor = (...args) => {
  return darken(...args)
}

export const getLightenColor = (...args) => {
  return lighten(...args)
}

const colors = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#f39c12',
  '#d35400',
  '#c0392b'
]
