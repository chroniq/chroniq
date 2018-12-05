import React from 'react'
import styled from 'styled-components'
import Chroniq from '@chroniq/chroniq/lib'
import moment from 'moment'

const resources = [
  {
    id: 1,
    title: 'Vivienne Thompson-Simmons'
  },
  {
    id: 2,
    title: 'Genevieve Washington-Henderson'
  },
  {
    id: 3,
    title: 'Charlotte Richardson'
  },
  {
    id: 4,
    title: 'Anastasia Anderson'
  }
]

const events = [
  {
    id: 1,
    resourceId: 1,
    title: 'Event 1',
    start: moment().toDate(),
    end: moment().add(2, 'hour').toDate()
  },
  {
    id: 2,
    resourceId: 2,
    title: 'Event 2',
    start: moment().toDate(),
    end: moment().add(1, 'day').add(2, 'hour').toDate()
  },
  {
    id: 3,
    resourceId: 3,
    title: 'Event 3',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(3, 'hour').toDate()
  },
  {
    id: 4,
    resourceId: 4,
    title: 'Event 4',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(4, 'hour').toDate()
  },
  {
    id: 5,
    resourceId: 1,
    title: 'Event 5',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(5, 'hour').toDate()
  },
  {
    id: 6,
    resourceId: 2,
    title: 'Event 6',
    start: moment().add(1, 'day').toDate(),
    end: moment().add(1, 'day').add(6, 'hour').toDate()
  }
]
class LayoutContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      headerRef: null
    }
  }

  getRef = (headerRef) => {
    if (!this.state.headerRef) {
      this.setState({ headerRef })
    }
  }

  render () {
    return (
      <Layout>
        <Sidebar id='sidebar' />
        <ContentPanel>
          <Header id='header' />
          <Content>
            <Chroniq
              toolbarTarget={'#header'}
              resourceTabsTarget={'#sidebar'}
              culture='de_DE'
              resources={resources}
              events={events}
            />
          </Content>
        </ContentPanel>
      </Layout>
    )
  }
}

export default () => {
  return (
    <LayoutContainer />
  )
}

const Layout = styled.div`
    padding: 8px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    background: white;
`

const Header = styled.div`
    flex: 0 0 80px;
    border-bottom: 1px solid #ddd;
    height: 80px;
    width: 100%;
`

const Sidebar = styled.div`
    width: 220px;
    background: white;
`

const ContentPanel = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background: white;
`

const Content = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: row;
    flex: 0 1 100%;
    background: #f8f8f8;
`
