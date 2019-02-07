import { getColorBy } from '../utils/colors'
import { get, set, length } from '../accessors'

export const DEFAULT_RESOURCE_ID = 'chrnq-default'

export const prepareResources = (resources, accessors, mutators) => {
  return length(resources)
    ? resources.map((resource, index) => {
      let color = getColor(resource, accessors, index)
      let maybeResource = set(resource, color, mutators.color)
      return maybeResource || resource
    })
    : [{
      id: DEFAULT_RESOURCE_ID,
      color: getColorBy(0)
    }]
}

const getColor = (resource, accessors, index) => {
  return get(resource, accessors.color) || getColorBy(index)
}
