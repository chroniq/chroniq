import React from 'react'
import Chroniq from '@chroniq/chroniq/lib'
import { action } from '@storybook/addon-actions'

import EventWrapperResourcesArray from '../../helper/EventWrapperResourcesArray'

export default () => <EventWrapperResourcesArray><Chroniq
  popup
  selectable
  withDragAndDrop
  onSelectEvent={action('onSelectEvent')}
  defaultDate={new Date()}
/></EventWrapperResourcesArray>
