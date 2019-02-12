// Calculating Tooltip type depends on Content and Event sizes + positions (default props 'detect')
export const chooseTooltipType = (contentCoords, eventCoords) => {
  const topValue = {
    type: 'top',
    value: (eventCoords.top > contentCoords.top) ? eventCoords.top - contentCoords.top : 1
  }
  const rightValue = {
    type: 'right',
    value: (eventCoords.right < contentCoords.right) ? contentCoords.right - eventCoords.right : 1
  }
  const bottomValue = {
    type: 'bottom',
    value: (eventCoords.bottom < contentCoords.bottom) ? contentCoords.bottom - eventCoords.bottom : 1
  }
  const leftValue = {
    type: 'left',
    value: (eventCoords.left > contentCoords.left) ? eventCoords.left - contentCoords.left : 1
  }

  const sortedValues = [topValue, rightValue, bottomValue, leftValue].sort((a, b) => a.value - b.value)
  const biggestValue = sortedValues[3]

  // Correct type considering value of another spaces
  if (biggestValue.type === 'right' || biggestValue.type === 'left') {
    if (topValue.value > bottomValue.value) {
      if (topValue.value > (biggestValue.value / 4)) {
        return 'top'
      }
    } else {
      if (bottomValue.value > (biggestValue.value / 4)) {
        return 'bottom'
      }
    }
  }

  return biggestValue.type
}

// Calculating coordinates for eventPopup (backgroundEventPopup)
export const calculateTooltipCoordinates = (type, tooltipCoverDivCoords, customComponentWidth, customComponentHeight, eventCoordinates, timeContentCoordinates) => {
  const {
    top,
    bottom,
    left,
    height,
    width
  } = eventCoordinates

  const contentCoords = timeContentCoordinates

  let tooltipCoordinates = { x: null, y: null, type }

  // Getting difference by Y ---> between eventPopup cover div and Event element
  let checkTooltipY = top + Math.abs(tooltipCoverDivCoords.top)
  if (tooltipCoverDivCoords.top > 0) {
    checkTooltipY = top - tooltipCoverDivCoords.top
  }

  if (type === 'top' || type === 'bottom') {
    tooltipCoordinates.x = Math.abs(tooltipCoverDivCoords.left) - Math.abs(left) - width / 2 + customComponentWidth / 2
  }

  if (type === 'right' || type === 'left') {
    if (top > 180 && contentCoords.bottom > bottom) {
      tooltipCoordinates.y = checkTooltipY + height / 2 + customComponentHeight / 2
    } else if (top > 180 && contentCoords.bottom < bottom) {
      tooltipCoordinates.y = checkTooltipY + 50 + customComponentHeight
    } else if (top < 180 && contentCoords.bottom < bottom) {
      tooltipCoordinates.y = Math.abs(tooltipCoverDivCoords.top) + contentCoords.height / 2 + customComponentHeight / 2
    } else if (top < 180 && contentCoords.bottom > bottom) {
      tooltipCoordinates.y = Math.abs(tooltipCoverDivCoords.top) + height + (contentCoords.top / 2) - customComponentHeight
    }
  }

  // Calculating coordinates of eventPopup type 'left' | 'right' | 'top' | 'bottom'
  switch (type) {
    case 'left':
      tooltipCoordinates.x = Math.abs(tooltipCoverDivCoords.left) - Math.abs(left) + customComponentWidth
      break
    case 'right':
      tooltipCoordinates.x = Math.abs(tooltipCoverDivCoords.left) - Math.abs(left) - width
      break
    case 'top':
      tooltipCoordinates.y = checkTooltipY
      break
    case 'bottom':
      tooltipCoordinates.y = checkTooltipY + height + customComponentHeight
      break
    default:
      tooltipCoordinates.x = null
      tooltipCoordinates.y = null
  }

  return tooltipCoordinates
}
