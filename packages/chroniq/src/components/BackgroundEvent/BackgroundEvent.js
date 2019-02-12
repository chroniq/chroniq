import React from 'react'
import PropTypes from 'prop-types'
import { get } from '@chroniq/chroniq-accessor-helpers'

import { getLightenColor } from '../../utils/colors'
import { classNames, compose } from '../../utils/helpers'
import { connect } from '../../store/connect'
import { makeIsSelected, makeIsDeactivated } from '../../store/selectors'

import SmartComponent from '@incoqnito.io/smart-component'

class BackgroundEvent extends React.Component {
  getBackgroundColor () {
    let {
      event,
      resources,
      accessors
    } = this.props

    let resourceId = get(event, accessors.event.resourceId)
    let resource = resources.find((resource) => get(resource, accessors.resource.id) === resourceId)
    let eventColor = get(event, accessors.event.color)
    let resourceColor = get(resource, accessors.resource.color)

    return event && eventColor ? eventColor : getLightenColor(0.3, resourceColor)
  }

  render () {
    let {
      date,
      event,
      className: passedClassname,
      style: passedStyle,
      backgroundEventComponent: BackgroundEventComponent
    } = this.props

    let {
      isDeactivated
    } = this.props.redux

    let backgroundColor = this.getBackgroundColor()
    let className = classNames(passedClassname, {
      'chrnq-background-event-wrapper': true,
      '--is-deactivated': isDeactivated
    })

    return (
      <div className={className} style={passedStyle}>
        { BackgroundEventComponent
          ? (
            <BackgroundEventComponent date={date} event={event} backgroundColor={backgroundColor} />
          ) : (
            <div
              className='chrnq-background-event'
              style={{
                backgroundColor: backgroundColor
              }}
            >
              <span className='chrnq-background-event-title'>{ event.title }</span>
            </div>
          )}
      </div>
    )
  }
}

BackgroundEvent.propTypes = {
  redux: PropTypes.shape({
    isSelected: PropTypes.bool,
    isDeactivated: PropTypes.bool
  }).isRequired,
  className: PropTypes.any,
  style: PropTypes.object,
  resources: PropTypes.any,
  event: PropTypes.any,
  accessors: PropTypes.object
}

const makeMapStateToProps = () => {
  const isSelected = makeIsSelected()
  const isDeactivated = makeIsDeactivated()

  const mapStateToProps = (state, props) => {
    let { accessors, event } = props
    return {
      redux: {
        isSelected: isSelected(state, accessors, event),
        isDeactivated: isDeactivated(state, accessors, event)
      }
    }
  }

  return mapStateToProps
}

export default compose(
  connect(makeMapStateToProps),
  SmartComponent({
    redux: {
      isSelected: (a, b) => a === b,
      isDeactivated: (a, b) => a === b
    }
  })
)(BackgroundEvent)
