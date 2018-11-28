import React from 'react'
import styled from 'styled-components'

const EventPopupWrapperDiv = styled.div`
  position: absolute;
  left: ${props => '-' + props.coordinatesX + 'px'};
  bottom: ${props => '-' + props.coordinatesY + 'px'};
  width: ${props => props.width};
  height: ${props => props.height};
`

export default class EventPopupWrapper extends React.PureComponent {
  render () {
    return (
      <EventPopupWrapperDiv 
        coordinatesX={this.props.coordinatesX}
        coordinatesY={this.props.coordinatesY}
        width={this.props.width}
        height={this.props.height}>
        {this.props.children}
      </EventPopupWrapperDiv>
    )
  }
}
