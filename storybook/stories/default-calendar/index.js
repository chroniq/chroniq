import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'

let stories = storiesOf('Default Calendar', module)

stories.addDecorator(withKnobs)

stories
  .add('default view',
    require('./default-view.js').default)
  .add('multiple instances',
    require('./multiple-instances.js').default)
  .add('in-layout',
    require('./in-layout.js').default)

  .add('selectable',
    require('./selectable.js').default)

  .add('selectable, step 15, 4 timeslots',
    require('./selectable-step-15-4-timeslots.js').default)

  .add('selectable, step 10, 6 timeslots',
    require('./selectable-step-10-6-timeslots.js').default)

  .add('selectable, step 5, 6 timeslots',
    require('./selectable-step-5-6-timeslots.js').default)

  .add('selectable, 3 timeslots',
    require('./selectable-3-timeslots.js').default)

  .add('selectable, 9 timeslots, force now to 9:30am',
    require('./selectable-9-timeslots.js').default)

  .add('first of the week all-day event',
    require('./first-of-week-all-day-event.js').default)

  .add('end of the week all-day event',
    require('./end-of-week-all-day-event.js').default)

  .add('event at end of week',
    require('./event-at-end-of-week.js').default)

  .add('event at start of week',
    require('./event-at-start-of-week.js').default)

  .add('events on a constrained day column',
    require('./events-on-constrained-day-column.js').default)

  .add('add custom date header',
    require('./custom-date-header.js').default)

  .add('no duration',
    require('./no-duration.js').default)

  .add('multi-day',
    require('./multi-day.js').default)

  .add('all-day',
    require('./all-day.js').default)

  .add('on-double-click-event',
    require('./on-double-click-event.js').default)

  .add('locale',
    require('./locale.js').default)
