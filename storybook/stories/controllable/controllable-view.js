import React from 'react'
import { compose } from 'redux'
import { withNotes } from '@storybook/addon-notes'
import Chroniq from '@chroniq/chroniq/lib'
import createEvents from '../../utils/createEvents'

import { action } from '@storybook/addon-actions'

const events = createEvents()

class DefaultView extends React.Component {
  state = {
    view: 'week'
  }
  onChangeView = (data) => {
    this.setState({
      view: data.view
    })
  }
  render () {
    return (
      <Chroniq
        view={this.state.view}
        onViewChange={this.onChangeView}
        events={events}
        date={new Date()}
      />
    )
  }
}

export default compose(
  withNotes('Boom')
)(() => <DefaultView />)
