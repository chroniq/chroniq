import { storiesOf } from '@storybook/react'

storiesOf('Ressource Calendar', module)
  .add('Ressource View less than 4 resources',
    require('./less-than-4-resources.js').default)

  .add('Ressource View more than 3 resources',
    require('./more-than-3-resources.js').default)

