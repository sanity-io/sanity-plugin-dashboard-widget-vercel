import {Box, Card, Stack, Text} from '@sanity/ui'
import React from 'react'

import {DEBUG_MODE} from '../../constants'

type Props = {
  name: string
  state: any // TODO: type correctly
}

const StateDebug = (props: Props) => {
  const {name, state} = props

  if (!DEBUG_MODE) {
    return null
  }

  return (
    <Card
      scheme="dark"
      style={{
        backgroundColor: 'rgba(0, 0, 255, 0.9)',
        borderRadius: '3px',
        fontSize: 1,
        fontWeight: 500,
        lineHeight: 'body',
        right: 0,
        opacity: 0.75,
        pointerEvents: 'none',
        position: 'absolute',
        textAlign: 'left',
        top: 0,
        zIndex: 9000,
      }}
    >
      <Box padding={2}>
        <Stack space={2}>
          <Text size={0}>Name: {name}</Text>
          <Text size={0}>state.value: {JSON.stringify(state.value)}</Text>
        </Stack>
      </Box>
    </Card>
  )
}

export default StateDebug
