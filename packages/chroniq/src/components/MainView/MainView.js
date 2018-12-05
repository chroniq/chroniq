import React from 'react'
import PropTypes from 'prop-types'

import { connect } from '../../store/connect'
import { getJoinedResources, getActiveResources } from '../../store/selectors'
import { joinResource, splitResource, activateResource, deactivateResource, activateAllResources, unpinAllResources } from '../../store/actions'
import { get, length, toArray } from '@chroniq/chroniq-accessor-helpers'
import { viewNames, viewComponents } from '../../utils/views'
import ResourceTabs from '../ResourceTabs/ResourceTabs'
import ResourceTabsContainer from '../ResourceTabs/ResourceTabsContainer'

class MainView extends React.PureComponent {
  generateTabAction = (resourceCount) => resourceCount > 1
    ? (resourceId) => this.props.redux.splitResource(resourceId)
    : (resourceId) => this.props.redux.joinResource(resourceId, this.props.accessors)

  onActivate = (resourceId, event) => {
    if (
      this.props.redux.activeResources &&
      this.props.redux.activeResources.includes(resourceId)
    ) {
      (event.metaKey || event.ctrlKey) && this.props.redux.activeResources.size > 1
        ? this.props.redux.deactivateResource(resourceId)
        : this.props.redux.activateAllResources()
    } else {
      this.props.redux.activateResource(resourceId, event.metaKey || event.ctrlKey)
    }
  }

  setScrollRef = (i) => (ref) => {
    this.props.scrollRefArray[i] = ref
  }

  setTimeScaleRef = (ref) => {
    this.timeScaleRef = ref
  }

  setAllDayRef = (ref) => {
    this.allDayRef = ref
  }

  render () {
    const {
      views,
      components,
      accessors,
      layoutStrategies,
      scrollRefArray,
      showMore,
      onScroll
    } = this.props

    const {
      joinedResources,
      resources,
      view,
      resourceTabsTarget,
      unpinAllResources
    } = this.props.redux

    const maybeComponents = viewComponents(components, view, viewNames(views))

    const View = views[view]
    const onlyDefaultResource = length(resources) === 1

    const allJoinedResources = joinedResources.length > 0
      ? [
        joinedResources
          .map((resourceId) => resources.find((resource) => {
            return get(resource, accessors.resource.id) === resourceId
          }))
      ]
      : []

    // Getting resources which are not joined (Pinned), concat it with array of joined resources
    const resourcesWithoutJoined = toArray(resources.filter((resource) => !joinedResources.some((resourceId) => get(resource, accessors.resource.id) === resourceId)))
    const allResources = allJoinedResources.concat(resourcesWithoutJoined)

    return (
      <div className='chrnq-resource-sheet-area'>
        {
          // Render Resources in Container to portal it to Sidebar element
          resourceTabsTarget &&
            <ResourceTabsContainer
              resourceTabsTarget={resourceTabsTarget}
              allResources={allResources}
              onlyDefaultResource={onlyDefaultResource}
              accessors={accessors}
              onSplit={this.generateTabAction}
              onActivate={this.onActivate}
              activeResources={this.props.redux.activeResources}
              unpinAllResources={unpinAllResources} />
        }
        {
          View.allowResources
            ? allResources
              .map((resources, index) => {
                if (!length(resources)) {
                  resources = [ resources ]
                }

                let key = resources.reduce((key, resource, index) => {
                  key += get(resource, accessors.resource.id)
                  return key
                }, '')

                return (
                  <div className='chrnq-view-container' key={key}>
                    {
                      // Don't render here if there is only one resource or selector of Sidebar is set up
                      (onlyDefaultResource || resourceTabsTarget)
                        ? null
                        : (
                          <ResourceTabs
                            drawUnpinButton={index === 0}
                            unpinAllResources={unpinAllResources}
                            accessors={accessors}
                            resources={resources}
                            onSplit={this.generateTabAction(length(resources))}
                            onActivate={this.onActivate}
                            activeResources={this.props.redux.activeResources}
                          />
                        )
                    }
                    <View
                      showGutter={index === 0}
                      resources={resources}
                      components={maybeComponents}
                      accessors={accessors}
                      layoutStrategies={layoutStrategies}
                      onShowMore={showMore}
                      onScroll={onScroll}
                      setScrollRef={this.setScrollRef(index)}
                      setTimeScaleRef={this.setTimeScaleRef}
                      setAllDayRef={this.setAllDayRef}
                    />
                  </div>
                )
              })
            : (
              <View
                resources={resources}
                components={maybeComponents}
                accessors={accessors}
                layoutStrategies={layoutStrategies}
                onShowMore={showMore}
                onScroll={onScroll}
                setTimeScaleRef={this.setTimeScaleRef}
                setAllDayRef={this.setAllDayRef}
              />
            )
        }
      </div>
    )
  }
}

MainView.propTypes = {
  redux: PropTypes.shape({
    joinedResources: PropTypes.array,
    resources: PropTypes.any,
    view: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.string
    ]).isRequired,

    joinResource: PropTypes.func.isRequired,
    splitResource: PropTypes.func.isRequired,

    activateResource: PropTypes.func.isRequired,
    deactivateResource: PropTypes.func.isRequired,
    activateAllResources: PropTypes.func.isRequired,
    activeResources: PropTypes.object
  }).isRequired,

  views: PropTypes.object.isRequired,
  showMore: PropTypes.func,
  onScroll: PropTypes.func,
  scrollRefArray: PropTypes.array,

  components: PropTypes.object.isRequired,
  accessors: PropTypes.object.isRequired,
  layoutStrategies: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  joinedResources: getJoinedResources(state),
  resources: state.getIn([ 'props', 'resources' ]),
  view: state.getIn([ 'props', 'view' ]),
  activeResources: getActiveResources(state),
  resourceTabsTarget: state.getIn([ 'props', 'resourceTabsTarget' ])
})

const mapDispatchToProps = {
  joinResource,
  splitResource,
  activateResource,
  deactivateResource,
  activateAllResources,
  unpinAllResources
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MainView)
