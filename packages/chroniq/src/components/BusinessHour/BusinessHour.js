import React from 'react'
import PropTypes from 'prop-types'

import { classNames } from '../../utils/helpers'

class BusinessHour extends React.PureComponent {
  render () {
    return (
      <div
        className={classNames({
          'chrnq-business-hour': true
        })}
      />
    )
  }
}

BusinessHour.propTypes = {
  className: PropTypes.any,
  style: PropTypes.object,
  resources: PropTypes.any,
  event: PropTypes.any,
  accessors: PropTypes.object
}

export default BusinessHour
