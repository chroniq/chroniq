import React from 'react'
import { createPortal } from 'react-dom'

import { length } from '@chroniq/chroniq-accessor-helpers'

import ResourceTabs from './ResourceTabs'

export default class ResourceTabsContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = { isMounted: false }
  }

  componentDidMount () {
    this.setState({ isMounted: true })
  }

  render () {
    const {
      resourceTabsTarget,
      allResources,
      onlyDefaultResource,
      accessors,
      onSplit,
      onActivate,
      activeResources,
      unpinAllResources
    } = this.props

    return (
      // Render only when this component is mounted and selector for portaling is set
      (resourceTabsTarget && this.state.isMounted) && createPortal(
        <div className='chrnq-resource-tabs-portaled-container'>
          {
            // Creating list of resources in Sidebar element
            allResources.map((resources, index) => {
              if (!length(resources)) {
                resources = [ resources ]
              }

              return (
                onlyDefaultResource
                  ? null
                  : (
                    <ResourceTabs
                      key={index}
                      drawUnpinButton={index === 0}
                      unpinAllResources={unpinAllResources}
                      resourceTabsTarget={resourceTabsTarget}
                      accessors={accessors}
                      resources={resources}
                      onSplit={onSplit(length(resources))}
                      onActivate={onActivate}
                      activeResources={activeResources}
                    />
                  )
              )
            })
          }
        </div>,
        document.querySelector(resourceTabsTarget))
    )
  }
}

