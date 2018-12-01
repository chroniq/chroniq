import React from 'react'
import styled from 'styled-components'
import { select, selectV2 } from '@storybook/addon-knobs/react'

import { action } from '@storybook/addon-actions'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC'

export default () => <EventProviderHOC>
  <Chroniq
    withDragAndDrop
    selectable
    enableEventPopup
    eventPopupDirection={select('Direction', {
      detect: 'detect',
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      left: 'left'
    }, 'detect', 'direction')}
    view='week'
    date={new Date()}
  />
</EventProviderHOC>
