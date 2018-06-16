import { views } from './constants'
import { omit, defaults } from './helpers'
import { length } from '@chroniq/chroniq-accessor-helpers'

import Month from '@chroniq/chroniq-view-month'
import Week from '@chroniq/chroniq-view-week'
import WorkWeek from '@chroniq/chroniq-view-workweek'
import Day from '@chroniq/chroniq-view-day'
import Agenda from '@chroniq/chroniq-view-agenda'
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
