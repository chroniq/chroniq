import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'

let stories = storiesOf('Event Popup', module)

stories.addDecorator(withKnobs)

stories
  .add('event-popup',
    require('./event-popup.js').default)
