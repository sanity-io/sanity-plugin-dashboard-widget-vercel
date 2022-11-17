import {Box} from '@sanity/ui'
import React from 'react'
import {useCardColor} from '../../utils/useCardColor'

const PlaceholderAvatar = () => {
  const {border} = useCardColor()
  return (
    <Box
      style={{
        backgroundColor: border,
        borderRadius: '20px',
        height: '20px',
        userSelect: 'none',
        width: '20px',
      }}
    />
  )
}

export default PlaceholderAvatar
