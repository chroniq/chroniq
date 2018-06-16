import { storiesOf } from '@storybook/react'

storiesOf('Drag and Drop', module)
  .add('Default View',
    require('./default-view.js').default)
  .add('onEventDrag',
    require('./on-event-drag.js').default)
  .add('onEventDragBegin',
    require('./on-event-drag-begin.js').default)
  .add('Ressource View less than 4 resources',
    require('./less-than-4-resources.js').default)
  .add('Ressource View more than 3 resources',
    require('./more-than-3-resources.js').default)
  .add('Drag Slot Duration 10 minutes',
    require('./drag-slot-duration.js').default)
  .add('Dynamic Drag Slot Duration',
    require('./dynamic-drag-slot-duration.js').default)
