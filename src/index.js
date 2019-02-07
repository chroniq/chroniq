import moment from 'moment'
import Calendar from './components/Calendar/Calendar'
import EventWrapper from './components/EventWrapper/EventWrapper'
import BackgroundWrapper from './components/BackgroundWrapper/BackgroundWrapper'
import { set as setLocalizer } from './localizer'
import momentLocalizer from './momentLocalizer'
import { views, navigate } from './utils/constants'

setLocalizer(momentLocalizer(moment))

const Chroniq = Calendar

Object.assign(Chroniq, {
  Views: views,
  Navigate: navigate,
  components: {
    eventWrapper: EventWrapper,
    dayWrapper: BackgroundWrapper,
    dateCellWrapper: BackgroundWrapper
  }
})

export default Chroniq
