const generateOverlappingEventsCheck = (overlappingEventsObject) =>
  (a, b) => typeof overlappingEventsObject[a] !== 'undefined'
    ? typeof overlappingEventsObject[a][b] !== 'undefined'
      ? overlappingEventsObject[a][b]
      : undefined
    : undefined

const setDeep = (a, b, object, value) => {
  if (typeof object[a] === 'undefined') {
    object[a] = {}
  }

  object[a][b] = value
}

const generateSetCalculatedValue = (overlappingEventsObject) =>
  (a, b, value) => {
    setDeep(a, b, overlappingEventsObject, value)
    setDeep(b, a, overlappingEventsObject, value)
  }

const generateDoOverlap = (getStart, getEnd) =>
  (a, b) => {
    if (getEnd(a) <= getStart(b)) {
      return false
    }

    if (getEnd(b) <= getStart(a)) {
      return false
    }

    return true
  }

const generateCalculateOverlappingEvents = (overlappingEventsObject, events, getStart, getEnd, getId) => {
  const checkAlreadyCalculatedValue = generateOverlappingEventsCheck(overlappingEventsObject)
  const setCalculatedValue = generateSetCalculatedValue(overlappingEventsObject)
  const doOverlap = generateDoOverlap(getStart, getEnd)

  return (event) => {
    return events.filter((otherEvent) => {
      if (otherEvent === event) {
        return false
      }

      const alreadyCalculatedValue = checkAlreadyCalculatedValue(getId(event), getId(otherEvent))

      if (typeof alreadyCalculatedValue !== 'undefined') {
        return alreadyCalculatedValue
      }

      const value = doOverlap(event, otherEvent)
      setCalculatedValue(getId(event), getId(otherEvent), value)

      return value
    })
  }
}

const generateGetMaxDepth = (getStart, getEnd) => {
  const getMaxDepth = (event, calculateOverlappingEvents, timeFrame = { start: 0, end: Number.MAX_SAFE_INTEGER }, excludedEvents = [], depth = 1) => {
    const overlappingEvents = calculateOverlappingEvents(event)
      .filter((event) => !excludedEvents.includes(event))
      .filter((overlappingEvent) => getStart(overlappingEvent) < timeFrame.end && getEnd(overlappingEvent) > timeFrame.start) // only allow events which overlap with every excluded event

    const overlappingEventsStartingAfter = overlappingEvents
      .filter((overlappingEvent) => !isBefore(overlappingEvent, event))

    if (overlappingEventsStartingAfter.length === 0) {
      return depth + overlappingEvents.length
    } else {
      return overlappingEvents
        .map((overlappingEvent) => getMaxDepth(overlappingEvent, calculateOverlappingEvents, {
          start: Math.max(timeFrame.start, getStart(event)),
          end: Math.min(timeFrame.end, getEnd(event))
        }, excludedEvents.concat(event), depth + 1))
        .sort((a, b) => b - a/* largest first */)[0]
    }
  }

  return getMaxDepth
}

const isBefore = (a, b) => {
  if (a.start < b.start) {
    return true
  }

  if (a.start === b.start && a.end < b.end) {
    return true
  }

  return false
}

const calculatePossibleOffsets = (alreadyPositionedOverlappingEventStyles) => alreadyPositionedOverlappingEventStyles
  .sort((a, b) => a.xOffset - b.xOffset)
  .reduce((result, style, index) => {
    if (index === 0) {
      if (index === alreadyPositionedOverlappingEventStyles.length - 1) { // only element
        const spaceAvailableLeft = style.xOffset
        const spaceAvailableRight = 100 - (style.xOffset + style.width)

        result.push({
          availableSpace: spaceAvailableRight,
          xOffset: style.xOffset + style.width
        })

        result.push({
          availableSpace: spaceAvailableLeft,
          xOffset: 0
        })

        return result
      } else {
        result.push({
          availableSpace: style.xOffset,
          xOffset: 0
        })

        return result
      }
    }

    const leftSideEventXEnd = alreadyPositionedOverlappingEventStyles[index - 1].xOffset + alreadyPositionedOverlappingEventStyles[index - 1].width
    result.push({
      availableSpace: style.xOffset - leftSideEventXEnd,
      xOffset: leftSideEventXEnd
    })

    if (index === alreadyPositionedOverlappingEventStyles.length - 1) {
      const rightEventEnd = style.xOffset + style.width
      const spaceAvailableRight = 100 - rightEventEnd

      result.push({
        availableSpace: spaceAvailableRight,
        xOffset: rightEventEnd
      })
    }

    return result
  }, [])
  .filter((result) => result.availableSpace > 0)
  .sort((a, b) => {
    const spaceDiff = Math.round(b.availableSpace) - Math.round(a.availableSpace)
    if (spaceDiff !== 0) {
      return spaceDiff
    }

    return a.xOffset - b.xOffset // prefer slots which are on the left side
  })

export default (events, { getStart, getEnd, getId, slotDuration, slotInterval }) => {
  const overlappingEventsObject = {}
  const calculateOverlappingEvents = generateCalculateOverlappingEvents(overlappingEventsObject, events, getStart, getEnd, getId)
  const getMaxDepth = generateGetMaxDepth(getStart, getEnd)

  const result = events.reduce((styles, event) => {
    const overlappingEvents = calculateOverlappingEvents(event)
    const alreadyPositionedOverlappingEventStyles = []
    const unpositionedOverlappingEvents = []
    const positionedOverlappingEvents = []

    for (let i = 0; i < overlappingEvents.length; i++) {
      const style = styles[getId(overlappingEvents[i])]

      if (typeof style === 'undefined') {
        unpositionedOverlappingEvents.push(overlappingEvents[i])
      } else {
        alreadyPositionedOverlappingEventStyles.push(style)
        positionedOverlappingEvents.push(overlappingEvents[i])
      }
    }

    const possibleOffsets = calculatePossibleOffsets(alreadyPositionedOverlappingEventStyles)

    const xOffset = possibleOffsets.length > 0 ? possibleOffsets[0].xOffset : 0
    let maxDepth = getMaxDepth(event, calculateOverlappingEvents)

    const style = {
      xOffset,
      width: (possibleOffsets.length > 0 ? possibleOffsets[0].availableSpace : 100) / (maxDepth - alreadyPositionedOverlappingEventStyles.length)
    }

    if (style.xOffset + style.width < 100 && maxDepth - alreadyPositionedOverlappingEventStyles.length > 1) {
      const cantGrowBigger = unpositionedOverlappingEvents.some((event) => {
        const overlappingEventStyles = calculateOverlappingEvents(event)
          .map((event) => styles[getId(event)])
          .filter((style) => typeof style !== 'undefined')
          .concat(style)

        const possibleOffsets = calculatePossibleOffsets(overlappingEventStyles)
        const xOffset = possibleOffsets.length > 0 ? possibleOffsets[0].xOffset : 0

        if (Math.round(xOffset) === Math.round(style.xOffset + style.width)) {
          return true
        } else {
          return false
        }
      })

      if (!cantGrowBigger) {
        maxDepth--
      }
    }

    styles[getId(event)] = {
      xOffset,
      width: (possibleOffsets.length > 0 ? possibleOffsets[0].availableSpace : 100) / (maxDepth - alreadyPositionedOverlappingEventStyles.length)
    }

    return styles
  }, {})

  return result
}
