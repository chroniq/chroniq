import { storiesOf } from '@storybook/react'

storiesOf('Business Hours', module)
  .add(
    'Default View',
    require('./default-view.js').default
  )
  .add(
    'Per Resources',
    require('./per-resources.js').default
  )
  .add(
    'Per Resources with Fallback',
    require('./per-resources-with-fallback.js').default
  )
