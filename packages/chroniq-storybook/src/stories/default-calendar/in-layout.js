import React from 'react'
import styled from 'styled-components'
import Chroniq from '@chroniq/chroniq/lib'

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
        <Sidebar />
        <ContentPane>
          <Header id='header' />
          <Content>
            <Chroniq
              toolbarTarget={'#header'}
              date={new Date(2016, 11, 4)}
              culture='de_DE'
              resources={resources}
              events={[
                {
                  id: 1,
                  title: 'start of the week',
                  start: new Date(2016, 11, 4, 15),
                  end: new Date(2016, 11, 5, 3),
                  color: '#be2edd'
                },
                {
                  id: 2,
                  title: 'end of the week',
                  start: new Date(2016, 11, 3),
                  end: new Date(2016, 11, 3)
                },
                {
                  id: 3,
                  title: 'middle',
                  start: new Date(2016, 11, 6),
                  end: new Date(2016, 11, 6)
                }
              ]}
            />
          </Content>
        </ContentPane>
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
`

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0 0 220px;
    background: #3498db;
`

const ContentPane = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    background: white;
`

const Content = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: row;
    flex: 0 1 100%;
    background: #f8f8f8;
`
