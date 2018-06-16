import React from 'react'

import { classNames } from '../../utils/helpers'

import { connect } from '../../store/connect'
import { isDragging } from '../../store/selectors'

const Container = ({ isRtl, dndEnabled, isDragging, className, style, children }) => (
  <div
    style={style}
    className={classNames('chrnq-calendar', className, {
      'chrnq-rtl': isRtl,
      'chrnq-dnd': dndEnabled,
      'chrnq-dnd-is-dragging': isDragging
    })}
  >
    { children }
  </div>
)

Container.defaultProps = {
  dndEnabled: true
}

const mapStateToProps = (state) => ({
  isDragging: isDragging(state)
})

export default connect(mapStateToProps, null, null, {
  areStatesEqual: (a, b) => isDragging(a) === isDragging(b)
})(Container)
