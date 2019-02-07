import { storiesOf } from '@storybook/react'

storiesOf('Background Events', module)
  .add(
    'Default View',
    require('./default-view.js').default
  )
  .add(
    'BackgroundEvents per Resource',
    require('./background-events-per-resource.js').default
  )
  .add(
    'onSelectBackgroundEvent',
    require('./on-select-background-event.js').default
  )
