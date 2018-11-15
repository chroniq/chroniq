import { storiesOf } from '@storybook/react'

storiesOf('Resources Array', module)
  .add(
    'Processing Events with resourceId: id || []',
    require('./resources-array.js').default
  )
