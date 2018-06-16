import PropTypes from 'prop-types'
import React from 'react'
import dates from '../../utils/dates'

import { get } from '@chroniq/chroniq-accessor-helpers'

import getStyledEvents from '../../utils/dayViewLayout'

import { connect } from '../../store/connect'
import { compose } from '../../utils/helpers'
import { makeGetBusinessHoursForResourcesAndRange } from '../../selectors/businessHours'

import SmartComponent from '@incoqnito.io/smart-component'

const checkFlatEquality = (a, b) => Object.keys(a).reduce((result, key) => a[key] === b[key] ? result : false, true)

class EventContainer extends React.Component {
  render () {
    return (
      <div className='chrnq-business-hour-container'>
        { this.renderBusinessHours() }
      </div>
    )
  }

  renderBusinessHours = () => {
    let {
      minTime,
      maxTime,
      rtl,
      slotDuration,
      slotInterval,
      accessors
    } = this.props

    const {
      businessHours
    } = this.props.redux

    let styledEvents = getStyledEvents(businessHours, {
      accessors: accessors.event,
      minTime,
      maxTime,
      slotDuration,
      slotInterval,
      layoutStrategy: (events, { getId }) => ({})
    })

    return styledEvents.map(({ event, style: yStyle }) => {
      let resourceId = get(event, accessors.event.resourceId)
      let eventId = get(event, accessors.event.id)
      let style = {
        height: yStyle.height + '%',
        [rtl ? 'right' : 'left']: `${Math.max(0, yStyle.xOffset)}%`,
        width: '100%',
        top: yStyle.top + '%'
      }
      if (event.color) {
        style['backgroundColor'] = get(event, accessors.event.color)
        style['zIndex'] = -2
      }
      let key = typeof eventId !== 'undefined' ? `bg-${eventId}` : `bg-${resourceId}${yStyle.height}${style.top}`

      return (
        <div
          key={key}
          className='chrnq-business-hour'
          style={style} />
      )
    })
  }
}

EventContainer.defaultProps = {
  dragThroughEvents: true
}

EventContainer.propTypes = {
  redux: PropTypes.shape({
    businessHours: PropTypes.array.isRequired
  }).isRequired,
  resources: PropTypes.any,
  accessors: PropTypes.object.isRequired,
  slotDuration: PropTypes.number.isRequired,
  slotInterval: PropTypes.number.isRequired,
  minTime: PropTypes.instanceOf(Date).isRequired,
  maxTime: PropTypes.instanceOf(Date).isRequired,
  rtl: PropTypes.bool,
  layoutStrategies: PropTypes.object.isRequired
}

const makeMapStateToProps = () => {
  const GetBusinessHoursForResourcesAndRange = makeGetBusinessHoursForResourcesAndRange()
  const mapStateToProps = (state, props) => {
    let { resources, accessors, date } = props
    let range = [ date ]
    return {
      businessHours: GetBusinessHoursForResourcesAndRange(state, resources, accessors, range)
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = {
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps, mergeProps),
  SmartComponent({
    'resources': checkFlatEquality
  })
)(EventContainer)
