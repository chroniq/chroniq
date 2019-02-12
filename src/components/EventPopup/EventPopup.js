import React from 'react'

import EventPopupWrapper from './EventPopupWrapper'
import EventPopupDefault from './EventPopupDefault'

import { chooseTooltipType, calculateTooltipCoordinates } from './helpers'

export default class EventPopup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tooltipData: false,
      eventPopupWrapperWidth: 0,
      eventPopupWrapperHeight: 0
    }

    this.tooltipCoverDiv = null
    this.customViewRef = null
  }

  componentDidMount () {
    const tooltipCoverCoords = this.tooltipCoverDiv.getBoundingClientRect()
    // Getting width and height of custom eventPopupComponent
    const customViewCoords = this.customViewRef.getBoundingClientRect()

    let direction = this.props.direction
    // Use default 'detect' type or not
    if (direction !== 'top' && direction !== 'right' && direction !== 'bottom' && direction !== 'left') {
      direction = chooseTooltipType(this.props.timeContentCoordinates, this.props.eventCoordinates)
    }
    const tooltipData = calculateTooltipCoordinates(direction, tooltipCoverCoords, customViewCoords.width, customViewCoords.height, this.props.eventCoordinates, this.props.timeContentCoordinates)
    this.setState({
      tooltipData,
      eventPopupWrapperWidth: customViewCoords.width,
      eventPopupWrapperHeight: customViewCoords.height
    })
  }

  // Calculating Tooltip type depends on Content and Event sizes + positions (default props 'detect')
  chooseTooltipType (contentCoords, eventCoords) {
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

  // Calculating coordinates for eventPopup
  calculateTooltipCoordinates (type, tooltipCoverDivCoords, customComponentWidth, customComponentHeight) {
    const {
      top,
      bottom,
      left,
      right,
      height,
      width
    } = this.props.eventCoordinates

    const contentCoords = this.props.timeContentCoordinates

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

  render () {
    const {
      eventPopupView: EventPopupView,
      event
    } = this.props
    const coordinatesX = (this.state.tooltipData.x) ? this.state.tooltipData.x : 0
    const coordinatesY = (this.state.tooltipData.y) ? this.state.tooltipData.y : 0
    return (
      <div ref={el => this.tooltipCoverDiv = el} style={{ position: 'relative', zIndex: '102' }}>
        <EventPopupWrapper
          coordinatesX={coordinatesX}
          coordinatesY={coordinatesY}
          width={this.state.eventPopupWrapperWidth}
          height={this.state.eventPopupWrapperHeight}>
          {
            (this.props.eventPopupView)
              ? <EventPopupView
                onRef={(el) => this.customViewRef = el}
                event={event} />
              : <EventPopupDefault
                onRef={(el) => this.customViewRef = el}
                event={event} />
          }
        </EventPopupWrapper>
      </div>
    )
  }
}
