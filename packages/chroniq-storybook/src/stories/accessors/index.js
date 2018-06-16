import { storiesOf } from '@storybook/react'

storiesOf('Accessors', module)
  .add('immutable accessors',
    require('./immutable-accessors.js').default)
  .add('backbone accessors',
    require('./backbone-accessors.js').default)
  .add('only event accessors',
    require('./only-event-accessors.js').default)
  .add('only resource accessors',
    require('./only-resource-accessors.js').default)
