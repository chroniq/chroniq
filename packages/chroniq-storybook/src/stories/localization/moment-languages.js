import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { action } from '@storybook/addon-actions'
import EventProviderHOC from '../../helper/EventProviderHOC.js'
import Chroniq from '@chroniq/chroniq/lib'

class Page extends React.Component {
  languages = Object.freeze([ {
    code: 'de',
    title: 'German'
  }, {
    code: 'en-gb',
    title: 'English (GB)'
  }, {
    code: 'en-us',
    title: 'English (US)'
  }, {
    code: 'fr',
    title: 'French'
  } ])

  componentWillMount () {
    this.onSelectLanguage(this.languages[0].code)
  }

  onSelectLanguage = (langCode) => {
    moment.locale(langCode)
    this.setState({
      selectedLanguage: langCode
    })
  }

  render () {
    return (
      <Wrapper>
        <RadioButtonBox>
          {
            this.languages.map((lang) => (
              <RadioButtonWrapper key={lang.code}>
                <RadioButton checked={this.state.selectedLanguage === lang.code} onChange={() => this.onSelectLanguage(lang.code)} />
                <RadioButtonDescr>
                  { lang.title }
                </RadioButtonDescr>
              </RadioButtonWrapper>
            ))
          }
        </RadioButtonBox>

        <EventProviderHOC>
          <Chroniq
            popup
            selectable
            withDragAndDrop
            onSelectEvent={action('event selected (IDs of selected events)')}
            onEventDrop={action('event dropped')}
            onEventResize={action('event resized')}
            defaultDate={new Date()}
          />
        </EventProviderHOC>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`

const RadioButtonBox = styled.div`
  display: inline-block;
  width: 50%;
`

const RadioButtonWrapper = styled.div`
  display: inline-block;
  width: 50%;
  margin-bottom: 8px;
`

const RadioButton = styled.input.attrs({
  type: 'radio'
})`
  display: inline-block;
  margin-right: 8px;
`

const RadioButtonDescr = styled.span``

export default () => <Page />
