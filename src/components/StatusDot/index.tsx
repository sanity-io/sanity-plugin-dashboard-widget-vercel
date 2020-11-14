import { Vercel } from '@types'
import React from 'react'
import { Box } from 'theme-ui'

type Props = {
  state: Vercel.DeploymentState
}

const StatusDot = ({ state, ...props }: Props) => (
  <Box
    {...props}
    sx={{
      borderRadius: '20px',
      size: '10px',
    }}
    variant={`statusDots.${state}`}
  />
)

export default StatusDot
