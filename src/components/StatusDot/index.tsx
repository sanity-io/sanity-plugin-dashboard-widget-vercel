import { Vercel } from '@types'
import React from 'react'
import { Box, SxProps } from 'theme-ui'

type Props = {
  state: Vercel.DeploymentState
  sx?: SxProps
  variant?: string
}

const StatusDot = ({ state, variant, ...props }: Props) => (
  <Box
    {...props}
    sx={{
      bg: `vercelStatusColors.${state}`,
      ...props.sx,
    }}
    variant={variant}
  />
)

export default StatusDot
