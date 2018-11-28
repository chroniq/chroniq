import React from 'react'
import styled from 'styled-components'
import { select, selectV2 } from '@storybook/addon-knobs/react'

import { action } from '@storybook/addon-actions'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC'

const eventPopup = styled.div`
  border: 2px solid red;
  height: 200px;
  width: 200px;
`

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
    components={{
      eventPopupView: eventPopup
    }}
    date={new Date()}
  />
</EventProviderHOC>
