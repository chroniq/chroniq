import React from 'react'
import PropTypes from 'prop-types'

import { connect } from '../../store/connect'
import { getJoinedResources, getActiveResources } from '../../store/selectors'
import { joinResource, splitResource, activateResource, deactivateResource, activateAllResources } from '../../store/actions'
import { get, length, toArray } from '../../accessors'
import { viewNames, viewComponents } from '../../utils/views'
import ResourceTabs from '../ResourceTabs/ResourceTabs'

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
      view
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

    return (
      <div className='chrnq-resource-sheet-area'>
        {
          View.allowResources
            ? allJoinedResources
              .concat(toArray(resources.filter((resource) => !joinedResources.some((resourceId) => get(resource, accessors.resource.id) === resourceId))))
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
                      onlyDefaultResource
                        ? null
                        : (
                          <ResourceTabs
                            accessors={accessors}
                            resources={resources}
                            onSplit={this.generateTabAction(length(resources))}
                            onActivate={this.onActivate}
                            activeResources={this.props.redux.activeResources}
                          />
                        )
                    }
                    <View
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
  activeResources: getActiveResources(state)
})

const mapDispatchToProps = {
  joinResource,
  splitResource,
  activateResource,
  deactivateResource,
  activateAllResources
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MainView)
