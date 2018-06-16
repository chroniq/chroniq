import React from 'react'

export default ({ style, ...props }) => {
  return (
    <div
      style={{
        ...style,
        position: 'absolute'
      }}
      className='chrnq-highlight-event'
    />
  )
}
