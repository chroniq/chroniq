import { get } from '@chroniq/chroniq-accessor-helpers'
import dates from './dates'

export function startsBefore (date, minTime) {
  return dates.lt(dates.merge(minTime, date), minTime, 'minutes')
}

export function positionFromDate (date, minTime, total) {
  if (startsBefore(date, minTime)) {
    return 0
  }

  let merged = dates.merge(minTime, date)
  let diff = dates.diff(minTime, merged, 'minutes')
  return Math.min(diff, total)
}

/**
 * Events will be sorted primarily according to earliest start time.
 * If two events start at the same time, the one with the longest duration will
 * be placed first.
 */
let sort = (events, accessors) => events.sort((a, b) => {
  let startA = +get(a, accessors.start)
  let startB = +get(b, accessors.start)

  if (startA === startB) {
    return +get(b, accessors.end) - +get(a, accessors.end)
  }

  return startA - startB
})

let getSlot = (event, accessor, minTime, totalMinTime) => event && positionFromDate(
  get(event, accessor), minTime, totalMinTime
)

let constructEvent = (title, start, end) => {
  return {
    title: title,
    start: start,
    end: end
  }
}

let handleMultiDayEvents = (title, start, end, current) => {
  let s = new Date(start)
  let e = new Date(end)
  let c = new Date(current)

  // use noon to compare dates to avoid DST issues
  s.setHours(12, 0, 0, 0)
  e.setHours(12, 0, 0, 0)
  c.setHours(12, 0, 0, 0)

  if (+c === +s && c < e) {
    // if current day is at the start, but spans multiple days, correct the end
    return constructEvent(title, start, dates.endOf(start, 'day'))
  } else if (c > s && c < e) {
    // if current day is in between start and end dates, span all day
    return constructEvent(title, current, dates.endOf(current, 'day'))
  } else if (c > s && +c === +e) {
    // if current day is at the end of a multi day event, start at midnight to the end
    return constructEvent(title, current, end)
  }
}

/**
 * Returns height and top offset, both in percentage, for an event at
 * the specified index.
 */
export const getYStyles = (event, {
  accessors, minTime, totalTime, slotDuration
}) => {
  let startDate = get(event, accessors.start) // start date
  let endDate = get(event, accessors.end) // end date
  let title = get(event, accessors.title)
  let currentDate = new Date(minTime) // min is the current date at midnight

  let multiDayEvent = handleMultiDayEvents(title, startDate, endDate, currentDate)

  let start = getSlot(multiDayEvent || event, multiDayEvent ? 'start' : accessors.start, minTime, totalTime)
  let end = Math.max(getSlot(multiDayEvent || event, multiDayEvent ? 'end' : accessors.end, minTime, totalTime), start + slotDuration)
  let top = start / totalTime * 100
  let bottom = end / totalTime * 100

  let height = bottom - top

  return {
    top,
    height
  }
}

/**
 * Takes an array of unsorted events, and returns a sorted array
 * containing the same events, but with an additional style property.
 * These styles will position the events.
 */
export default function getStyledEvents (events, {
  accessors, minTime, maxTime,
  slotDuration, slotInterval, layoutStrategy
}) {
  const totalTime = dates.diff(minTime, maxTime, 'minutes')
  const sortedEvents = sort(events, accessors)
  const helperArgs = { accessors, minTime, totalTime, slotDuration, slotInterval }

  const styles = layoutStrategy(sortedEvents, {
    getStart: (event) => get(event, accessors.start),
    getEnd: (event) => get(event, accessors.end),
    getId: (event) => get(event, accessors.id),
    slotDuration,
    slotInterval,
    minTime,
    totalTime
  })

  return sortedEvents.map((event) => ({
    event,
    style: {
      ...styles[get(event, accessors.id)],
      ...getYStyles(event, helperArgs)
    }
  }))
}
