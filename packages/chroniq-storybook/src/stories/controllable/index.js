import { storiesOf } from '@storybook/react'

storiesOf('Controllable', module)
  .add(
    'Controllable view',
    require('./controllable-view.js').default
  )
