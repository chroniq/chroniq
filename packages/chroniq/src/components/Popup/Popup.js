import PropTypes from 'prop-types'
import React from 'react'

import { getOffset, getScrollTop, getScrollLeft } from '../../utils/helpers'
import { get, length } from '@chroniq/chroniq-accessor-helpers'

import { connect } from '../../store/connect'
import { makeGetEventsForResourcesAndRange } from '../../selectors/events'
import { getCulture } from '../../store/selectors'

import EventCell from '../EventCell/EventCell'
import localizer from '../../localizer'

class Popup extends React.PureComponent {
  componentDidMount () {
    let { popupOffset = 5 } = this.props
    let { top, left, width, height } = getOffset(this.rootRef)
    let viewBottom = window.innerHeight + getScrollTop(window)
    let viewRight = window.innerWidth + getScrollLeft(window)
    let bottom = top + height
    let right = left + width

    if (bottom > viewBottom || right > viewRight) {
      let topOffset, leftOffset

      if (bottom > viewBottom) { topOffset = bottom - viewBottom + (popupOffset.y || +popupOffset || 0) }
      if (right > viewRight) { leftOffset = right - viewRight + (popupOffset.x || +popupOffset || 0) }

      this.setState({ topOffset, leftOffset }) //eslint-disable-line
    }
  }

  setRootRef = (ref) => {
    this.rootRef = ref
  }

  render () {
    const { events } = this.props.redux
    let {
      eventComponent,
      eventWrapperComponent,
      accessors,
      resources,
      ...props
    } = this.props

    let { left, width, top } = this.props.position
    let topOffset = (this.state || {}).topOffset || 0
    let leftOffset = (this.state || {}).leftOffset || 0

    let style = {
      top: Math.max(0, top - topOffset),
      left: left - leftOffset,
      minWidth: width + (width / 2)
    }

    const colors = length(resources) && resources.reduce((result, resource) => {
      let resourceId = get(resource, accessors.resource.id)
      let resourceColor = get(resource, accessors.resource.color)
      result[resourceId] = resourceColor
      return result
    }, {})

    return (
      <div ref={this.setRootRef} style={style} className='chrnq-overlay'>
        <div className='chrnq-overlay-header'>
          { localizer.format(props.slotStart, props.redux.formats.dayHeaderFormat, props.redux.culture) }
        </div>
        {
          events.map((event, idx) =>
            <EventCell key={idx}
              accessors={this.props.accessors}
              event={event}
              color={colors[get(event, accessors.event.resourceId)] || '#1abc9c'}
              eventComponent={eventComponent}
              eventWrapperComponent={eventWrapperComponent}
            />
          )
        }
      </div>
    )
  }
}

Popup.propTypes = {
  redux: PropTypes.shape({
    events: PropTypes.any,
    culture: PropTypes.string,
    formats: PropTypes.shape({
      dayHeaderFormat: PropTypes.string
    }).isRequired
  }).isRequired,

  accessors: PropTypes.object.isRequired,
  position: PropTypes.object,
  popupOffset: PropTypes.number,
  eventComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  eventWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ])
}

const makeMapStateToProps = () => {
  const getEventsForResourcesAndRange = makeGetEventsForResourcesAndRange()

  const mapStateToProps = (state, props) => {
    let { resources, accessors, date } = props
    let range = [date]

    return {
      redux: {
        events: getEventsForResourcesAndRange(state, resources, accessors, range),
        formats: {
          dayHeaderFormat: state.getIn([ 'props', 'formats', 'dayHeaderFormat' ])
        },
        culture: getCulture(state)
      }
    }
  }

  return mapStateToProps
}

export default connect(makeMapStateToProps)(Popup)
