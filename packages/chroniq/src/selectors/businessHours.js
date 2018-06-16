import moment from 'moment'
import { createSelector } from 'reselect'
import { compose } from 'redux'
import dates from '../utils/dates'

const getResources = (state, resources, accessors, range) => resources
const getRange = (state, resources, accessors, range) => range
const getAccessors = (state, resources, accessors, range) => accessors
const getBusinessHours = (state) => state.getIn([ 'props', 'businessHours' ])

export const makeGetBusinessHoursForResources = () => {
  return createSelector([
    getBusinessHours,
    getResources,
    getAccessors
  ], (businessHours, resources, accessors) => {
    if (resources.length > 1) {
      return businessHours
    } else {
      let [ resource ] = resources
      return resource.businessHours || businessHours
    }
  })
}

export const getDay = createSelector([
  getRange
], (range) => {
  return range.map((date) => moment(date).day())[0]
})

export const makeGetBusinessHoursForResourcesAndRange = () => {
  const getBusinessHoursForResources = makeGetBusinessHoursForResources()

  return createSelector([
    getBusinessHoursForResources,
    getRange,
    getAccessors
  ], (businessHours, range, accessors) => {
    if (!businessHours || businessHours.length < 1) {
      return []
    }
    let day = range.map((date) => moment(date).day())[0]
    let fullDay = {
      start: setTime(day, 0, 0),
      end: setTime(day, 23, 59)
    }

    return businessHours
      .filter(businessHour => businessHour.days.includes(day))
      .map((businessHour) => {
        let [ fromHours, fromMinutes ] = businessHour.from.split(':')
        let [ toHours, toMinutes ] = businessHour.to.split(':')
        let start = setTime(day, fromHours, fromMinutes)
        let end = setTime(day, toHours, toMinutes)

        return {
          start,
          end,
          color: 'white'
        }
      })
      .concat(fullDay)
      .map((bH, i) => ({
        ...bH,
        id: i
      }))
    // .sort((a, b) => sortEvents(a, b, accessors.backgroundEvent))
  })
}

const setTime = (date, hours, minutes) => compose(
  (d) => dates.hours(d, hours),
  (d) => dates.minutes(d, minutes)
)(date)
