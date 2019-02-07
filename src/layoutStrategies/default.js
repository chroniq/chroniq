import dates from '../utils/dates'

function startsBefore (date, minTime) {
  return dates.lt(dates.merge(minTime, date), minTime, 'minutes')
}

function positionFromDate (date, minTime, total) {
  if (startsBefore(date, minTime)) {
    return 0
  }

  const diff = dates.diff(minTime, dates.merge(minTime, date), 'minutes')
  return Math.min(diff, total)
}

const getSlot = (event, getStart, minTime, totalTime) => event && positionFromDate(
  getStart(event), minTime, totalTime
)

const isSibling = (idx1, idx2, { events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval }) => {
  const event1 = events[idx1]
  const event2 = events[idx2]

  if (!event1 || !event2) return false

  const start1 = getSlot(event1, getStart, minTime, totalTime)
  const start2 = getSlot(event2, getStart, minTime, totalTime)
  const end1 = getSlot(event1, getEnd, minTime, totalTime)

  return (Math.abs(start1 - start2) < (slotDuration * slotInterval) && start2 < end1)
}

const isChild = (parentIdx, childIdx, {
  events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval
}) => {
  if (isSibling(
    parentIdx, childIdx,
    { events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval }
  )) return false

  const parentEnd = getSlot(events[parentIdx], getEnd, minTime, totalTime)
  const childStart = getSlot(events[childIdx], getStart, minTime, totalTime)

  return parentEnd > childStart || (events[childIdx] && dates.endOf(getStart(events[childIdx]), 'day') < getEnd(events[parentIdx]))
}

const getSiblings = (idx, {
  events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval
}) => {
  let nextIdx = idx
  const siblings = []

  while (isSibling(
    idx, ++nextIdx, { events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval })
  ) {
    siblings.push(nextIdx)
  }

  return siblings
}

const getChildGroups = (idx, nextIdx, {
  events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval
}) => {
  const groups = []
  let nbrOfColumns = 0

  while (isChild(
    idx, nextIdx,
    { events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval }
  )) {
    const childGroup = [nextIdx]
    let siblingIdx = nextIdx

    while (isSibling(
      nextIdx, ++siblingIdx,
      { events, getStart, getEnd, minTime, totalTime, slotDuration, slotInterval }
    )) {
      childGroup.push(siblingIdx)
    }

    nbrOfColumns = Math.max(nbrOfColumns, childGroup.length)
    groups.push(childGroup)
    nextIdx = siblingIdx
  }

  return { childGroups: groups, nbrOfChildColumns: nbrOfColumns }
}

export const createStrategy = ({ overlapMultiplier }) => (events, { getStart, getEnd, getId, slotDuration, slotInterval, minTime, totalTime }) => {
  const styles = {}
  let idx = 0

  const helperArgs = {
    events,
    getStart,
    getEnd,
    slotDuration,
    slotInterval,
    minTime,
    totalTime
  }

  while (idx < events.length) {
    const siblings = getSiblings(idx, helperArgs)
    const { childGroups, nbrOfChildColumns } = getChildGroups(
      idx, idx + siblings.length + 1, helperArgs
    )
    const nbrOfColumns = Math.max(nbrOfChildColumns, siblings.length) + 1

    const parentWidth = 100 / nbrOfColumns;

    [ idx, ...siblings ].forEach((eventIdx, siblingIdx) => {
      const width = eventIdx === idx
        ? parentWidth
        : (100 - parentWidth) / (siblings.length)
      const xAdjustment = (siblingIdx <= 1 ? parentWidth : width) * (nbrOfColumns > 1 ? overlapMultiplier : 0)

      styles[eventIdx] = {
        width: width + xAdjustment,
        xOffset: (Math.max(
          0,
          parentWidth + (siblingIdx - 1) * width
        )) - xAdjustment
      }
    })

    childGroups.forEach(group => {
      let parentIdx = idx
      let siblingIdx = 0

      while (isChild(siblings[siblingIdx], group[0], helperArgs)) {
        parentIdx = siblings[siblingIdx]
        siblingIdx++
      }

      group.forEach((eventIdx, i) => {
        const parentStyle = styles[parentIdx]
        const spaceOccupiedByParent = parentStyle.width + parentStyle.xOffset
        const columns = Math.min(group.length, nbrOfColumns)
        const width = (100 - spaceOccupiedByParent) / columns
        const xAdjustment = spaceOccupiedByParent * overlapMultiplier

        styles[eventIdx] = {
          width: width + xAdjustment,
          xOffset: spaceOccupiedByParent + (width * i) - xAdjustment
        }
      })
    })

    idx += 1 + siblings.length + childGroups.reduce(
      (total, group) => total + group.length, 0
    )
  }

  return Object.keys(styles).reduce((result, eventIdx) => {
    result[getId(events[eventIdx])] = styles[eventIdx]

    return result
  }, {})
}

export default createStrategy({
  overlapMultiplier: 0.3
})
