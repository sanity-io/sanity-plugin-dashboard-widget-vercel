import { Box } from '@sanity/ui'
import React from 'react'

const PlaceholderAvatar = () => {
  return (
    <Box
      style={{
        backgroundColor: '#eee', // TODO: use sanity ui colors
        borderRadius: '20px',
        height: '20px',
        userSelect: 'none',
        width: '20px',
      }}
    />
  )
}

export default PlaceholderAvatar
