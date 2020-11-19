import React from 'react'
import { Box } from 'theme-ui'

type Props = {
  machineId: string
  // TODO: type correctly
  state: any
}

const StateDebug = (props: Props) => {
  const { machineId, state } = props

  return (
    <Box
      sx={{
        bg: 'rgba(0, 0, 255, 0.8)',
        borderRadius: '3px',
        color: 'white',
        fontSize: 0,
        fontWeight: 500,
        lineHeight: 'body',
        right: 0,
        p: 2,
        position: 'absolute',
        textAlign: 'left',
        top: 0,
      }}
    >
      machine ID: {machineId}
      <br />
      state.value: {JSON.stringify(state.value)}
    </Box>
  )
}

export default StateDebug
