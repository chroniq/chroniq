import React from 'react'
import styled from 'styled-components'

import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

const components = {
  month: {
    event: () => <CustomEventWrapper><CustomEvent color='#27ae60' /></CustomEventWrapper>
  },
  week: {
    event: () => <CustomEventWrapper><CustomEvent color='#c0392b' /></CustomEventWrapper>
  },
  day: {
    event: () => <CustomEventWrapper><CustomEvent color='#2980b9' /></CustomEventWrapper>
  }
}

export default () => <EventProviderHOC resourceCount={2}>
  <Chroniq
    popup
    selectable
    withDragAndDrop
    onSelectEvent={action('event selected')}
    onEventDrop={action('event dropped')}
    onEventResize={action('event resized')}
    defaultDate={new Date()}
    components={components}
    views={[ 'month', 'week', 'day' ]}
  />
</EventProviderHOC>

const CustomEventWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const CustomEvent = styled.div`
    background: #f8f8f8;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    flex: 0 1 auto;
    background: ${props => props.color};
`
