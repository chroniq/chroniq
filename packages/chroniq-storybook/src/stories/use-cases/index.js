import { storiesOf } from '@storybook/react'

storiesOf('Use Cases', module)
  .add(
    'Dynamic Timeslot/Steps Changing on Drag',
    require('./dynamic-timeslot-step-changing.js').default
  )
