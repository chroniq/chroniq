export const accessors = {
  event: {
    id: (event) => event.get('id'),
    resourceId: (event) => event.get('resourceId'),
    allDay: (event) => event.get('allDay'),
    title: (event) => event.get('title'),
    start: (event) => event.get('start'),
    end: (event) => event.get('end'),
    color: (event) => event.get('color')
  },
  backgroundEvent: {
    id: (backgroundEvent) => backgroundEvent.get('id'),
    resourceId: (backgroundEvent) => backgroundEvent.get('resourceId'),
    allDay: (backgroundEvent) => backgroundEvent.get('allDay'),
    title: (backgroundEvent) => backgroundEvent.get('title'),
    start: (backgroundEvent) => backgroundEvent.get('start'),
    end: (backgroundEvent) => backgroundEvent.get('end'),
    color: (backgroundEvent) => backgroundEvent.get('color')
  },
  businessHours: {
    id: resource => resource.get('id'),
    start: resource => resource.get('start'),
    end: resource => resource.get('end')
  },
  resource: {
    id: (resource) => resource.get('id'),
    title: (resource) => resource.get('title'),
    color: (resource) => resource.get('color')
  }
}

export const mutators = {
  event: {
    resourceId: (event, resourceId) => event.set('resourceId', resourceId)
  },
  backgroundEvent: {
    resourceId: (backgrundEvent, resourceId) => backgrundEvent.set('resourceId', resourceId)
  },
  resource: {
    color: (event, color) => event.set('color', color)
  }
}
