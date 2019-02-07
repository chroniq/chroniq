import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'

let stories = storiesOf('Event Popup', module)

stories.addDecorator(withKnobs)

stories
  .add('event-popup-on-hover',
    require('./event-popup-on-hover.js').default)
  .add('event-popup-on-click',
    require('./event-popup-on-click.js').default)
