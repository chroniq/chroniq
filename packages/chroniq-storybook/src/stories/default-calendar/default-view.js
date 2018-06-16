import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { select, selectV2 } from '@storybook/addon-knobs/react'

import { action } from '@storybook/addon-actions'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC'

const businessHours = [{
  days: [1, 2, 3, 4, 5],
  from: '08:00',
  to: '16:00'
}]

const Event = styled.div`
  background-color: ${props => props.color};
  border: 1px solid ${props => darken(0.1, props.color)};

  width: 100%;
  height: 100%;
`

const components = {
  week: {
    event: Event
  }
}

const minTime = moment('2 am', 'h a').toDate()
const maxTime = moment('10 pm', 'h a').toDate()

const DefaultView = () => <EventProviderHOC>
  <Chroniq
    withDragAndDrop
    selectable
    businessHours={businessHours}
    minTime={minTime}
    maxTime={maxTime}
    scrollTime={moment().set(12, 'hours').toDate()}
    view={selectV2('View', {
      month: 'month',
      week: 'week',
      day: 'day',
      agenda: 'agenda'
    }, 'week', 'view')}
    slotInterval={select('Slot Interval', {
      2: 2,
      4: 4,
      8: 8
    }, 2, 'slotInterval')}
    slotDuration={select('Slot Duration', {
      120: 120,
      60: 60,
      30: 30,
      20: 20,
      15: 15,
      10: 10,
      5: 5,
      1: 1
    }, 15, 'slotDuration')}
    //components={components}
    culture={select('Culture', {
      de: 'Deutsch',
      en_US: 'Englisch (AE)',
      en_GB: 'Englisch (BE)',
      fr: 'France'
    }, 'de', 'culture')}
    onSelectEvent={action('event selected')}
    date={new Date()}
  />
</EventProviderHOC>

export default DefaultView
