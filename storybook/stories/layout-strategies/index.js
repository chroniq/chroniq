import { storiesOf } from '@storybook/react'

storiesOf('Layout Strategies', module)
  .add('Default', require('./default.js').default)
  .add('Enhanced', require('./enhanced.js').default)
  .add('Mixed', require('./mixed.js').default)

