import React from 'react'
import PropTypes from 'prop-types'

import { classNames } from '../../utils/helpers'
import { get, length } from '@chroniq/chroniq-accessor-helpers'

class ResourceTabs extends React.PureComponent {
  onClick (id) {
    this.props.onSplit(id)
  }
  isPinned () {
    return length(this.props.resources) > 1
  }
  render () {
    let {
      accessors
    } = this.props

    return (
      <div className='chrnq-resource-tab'>
        {
          this.props.resources.map((resource) => {
            let color = get(resource, accessors.resource.color)
            let title = get(resource, accessors.resource.title)
            let id = get(resource, accessors.resource.id)

            return (
              <div className={classNames({
                '--is-pinned': this.isPinned(),
                '--is-active': this.props.activeResources && this.props.activeResources.includes(id),
                'chrnq-resource-tab-item': true })} key={id} style={{
                borderColor: color
              }}>
                <span
                  className={classNames('chrnq-resource-tab-item-content', {
                    '--is-pinned': this.isPinned()
                  })}
                  onClick={(event) => this.isPinned() && this.props.onActivate(id, event)}
                >
                  {
                    title
                  }
                </span>
                <span className='chrnq-resource-pin' onClick={() => this.onClick(id)}>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' version='1.1' fill='#000000'>
                    <g id='surface1' fill='#000000'>
                      <path d='M 20.53125 2.5625 L 19.84375 3.5 L 14.9375 10.1875 C 12.308594 9.730469 9.527344 10.472656 7.5 12.5 L 6.78125 13.1875 L 12.09375 18.5 L 4 26.59375 L 4 28 L 5.40625 28 L 13.5 19.90625 L 18.8125 25.21875 L 19.5 24.5 C 21.527344 22.472656 22.269531 19.691406 21.8125 17.0625 L 28.5 12.15625 L 29.4375 11.46875 Z M 20.78125 5.625 L 26.375 11.21875 L 20.15625 15.78125 L 19.59375 16.1875 L 19.78125 16.84375 C 20.261719 18.675781 19.738281 20.585938 18.59375 22.1875 L 9.8125 13.40625 C 11.414063 12.261719 13.324219 11.738281 15.15625 12.21875 L 15.8125 12.40625 L 16.21875 11.84375 Z ' fill='#000000' />
                    </g>
                  </svg>

                </span>
              </div>
            )
          })
        }
      </div>
    )
  }
}

ResourceTabs.propTypes = {
  resources: PropTypes.any,
  activeResources: PropTypes.object,
  onSplit: PropTypes.func,
  onActivate: PropTypes.func,
  accessors: PropTypes.object
}

export default ResourceTabs
