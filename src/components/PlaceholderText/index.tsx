import { Box, Stack, Text } from '@sanity/ui'
import React from 'react'

type Props = {
  rows: number
}

const PlaceholderText = (props: Props) => {
  const { rows } = props

  return (
    <Box
      style={{
        backgroundColor: '#eee', // TODO: use sanity ui colors
        borderRadius: '3px',
        userSelect: 'none',
        width: '100%',
      }}
    >
      <Stack space={2}>
        {new Array(rows).fill(undefined).map((_, index) => (
          <Text key={index} size={1}>
            &nbsp;
          </Text>
        ))}
      </Stack>
    </Box>
  )
}

export default PlaceholderText
