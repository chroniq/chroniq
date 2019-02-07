import React from 'react'
import PropTypes from 'prop-types'

class MonthSelector extends React.PureComponent {
  render () {
    let {
      onBackPress,
      onForwardPress,
      month
    } = this.props

    return (
      <div className='chrnq-date-selector'>
        <span className='chrnq-date-selector-date'>
          { month }
        </span>
        <i className='chrnq-date-selector-arrow' onClick={onBackPress}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' version='1.1' fill='#000000'>
            <g id='surface1' fill='#000000'>
              <path d='M 19.03125 4.28125 L 8.03125 15.28125 L 7.34375 16 L 8.03125 16.71875 L 19.03125 27.71875 L 20.46875 26.28125 L 10.1875 16 L 20.46875 5.71875 Z ' fill='#000000' />
            </g>
          </svg>
        </i>
        <i className='chrnq-date-selector-arrow' onClick={onForwardPress}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' version='1.1' fill='#000000'>
            <g id='surface1' fill='#000000'>
              <path d='M 12.96875 4.28125 L 11.53125 5.71875 L 21.8125 16 L 11.53125 26.28125 L 12.96875 27.71875 L 23.96875 16.71875 L 24.65625 16 L 23.96875 15.28125 Z ' fill='#000000' />
            </g>
          </svg>
        </i>
      </div>
    )
  }
}

MonthSelector.propTypes = {
  onBackPress: PropTypes.func,
  onForwardPress: PropTypes.func,
  month: PropTypes.string
}

export default MonthSelector
