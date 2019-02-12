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
