import {Box} from '@sanity/ui'
import React from 'react'

import {VERCEL_STATUS_COLORS} from '../../constants'
import {Vercel} from '../../types'

type Props = {
  state: Vercel.DeploymentState
}

const StatusDot = ({state}: Props) => (
  <Box
    style={{
      backgroundColor: `${VERCEL_STATUS_COLORS[state]}`,
      borderRadius: '20px',
      height: '9px',
      width: '9px',
    }}
  />
)

export default StatusDot
