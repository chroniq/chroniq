import { storiesOf } from '@storybook/react'

storiesOf('Localization', module)
  .add('Moment Locales',
    require('./moment-languages.js').default)
