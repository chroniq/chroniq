export const accessors = {
  event: {
    id: 'id',
    resourceId: 'resourceId',
    title: 'title',
    start: 'start',
    end: 'end',
    color: 'color',
    allDay: 'allDay'
  },
  backgroundEvent: {
    id: 'id',
    resourceId: 'resourceId',
    title: 'title',
    start: 'start',
    end: 'end',
    color: 'color'
  },
  businessHours: {
    id: 'id',
    start: 'start',
    end: 'end'
  },
  resource: {
    id: 'id',
    title: 'title',
    color: 'color'
  }
}

export const mutators = {
  event: {
    resourceId: 'resourceId'
  },
  backgroundEvent: {
    resourceId: 'resourceId'
  },
  resource: {
    color: 'color'
  }
}
