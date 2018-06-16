import { storiesOf } from '@storybook/react'

storiesOf('Custom Components', module)
  .add('events',
    require('./events.js').default)
  .add('background events',
    require('./background-events.js').default)
  .add('only monday and thuesday',
    require('./monday-tuesday.js').default)
  .add('workweek',
    require('./workweek.js').default)
  .add('list',
    require('./list.js').default)
