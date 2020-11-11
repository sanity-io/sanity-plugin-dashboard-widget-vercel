import React from 'react'
import { Box } from 'theme-ui'

import { DeploymentState } from '../../types'

type Props = {
  state: DeploymentState
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
