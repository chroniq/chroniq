import { views } from './constants'
import { omit, defaults } from './helpers'
import { length } from '../accessors'

import Month from '../components/Month/Month'
import Week from '../components/Week/Week'
import WorkWeek from '../components/WorkWeek/WorkWeek'
import Day from '../components/Day/Day'
import Agenda from '../components/Agenda/Agenda'
import EventWrapper from '../components/EventWrapper/EventWrapper'
import BackgroundWrapper from '../components/BackgroundWrapper/BackgroundWrapper'

const VIEWS = {
  [views.MONTH]: Month,
  [views.WEEK]: Week,
  [views.WORK_WEEK]: WorkWeek,
  [views.DAY]: Day,
  [views.AGENDA]: Agenda
}

export const viewNames = (_views) => {
  return !length(_views) ? Object.keys(_views) : _views.map((view) => view.toString())
}

export const viewComponents = (components, view, viewNames) => {
  return defaults(
    components[view] || {},
    omit(components, viewNames),
    {
      eventWrapper: EventWrapper,
      dayWrapper: BackgroundWrapper,
      dateCellWrapper: BackgroundWrapper
    }
  )
}

export default VIEWS
