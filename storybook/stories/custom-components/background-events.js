import React from 'react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import moment from 'moment'
import Chroniq from '@chroniq/chroniq/lib'
import EventProviderHOC from '../../helper/EventProviderHOC'

const DefaultView = () =>
  <Chroniq
    view='week'
    minTime={moment('12:00am', 'h:mma').toDate()}
    maxTime={moment('11:59pm', 'h:mma').toDate()}
    events={[]}
    onSelectBackgroundEvent={action('background event selected')}
    backgroundEvents={[{
      id: 1,
      color: '#d63031',
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .hour(8)
        .minute(0)
        .toDate()
    }, {
      id: 2,
      title: 'Boom',
      start: moment()
        .hour(3)
        .minute(0)
        .toDate(),
      end: moment()
        .hour(5)
        .minute(0)
        .toDate()
    }, {
      id: 3,
      start: moment()
        .hour(18)
        .minute(30)
        .toDate(),
      end: moment()
        .hour(22)
        .minute(0)
        .toDate()
    } ]}
    components={{
      backgroundEvent: BgEvent
    }}
    onSelectEvent={action('event selected')}
    date={new Date()}
  />

const BgEvent = styled.div`
  border: 1px solid black;
  height: 100%;
  width: 100%;
`

export default DefaultView
