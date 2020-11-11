import { Vercel } from '@types'
import React from 'react'
import { Box } from 'theme-ui'

import DeploymentRow from '../DeploymentRow'

type Props = {
  aliases: Vercel.Alias[]
  deployments: Vercel.Deployment[]
}

const TH = ({ ...props }) => (
  <Box
    as="th"
    {...props}
    sx={{
      ...props.sx,
      borderBottom: '1px solid #eee',
      fontWeight: 'normal',
      px: 3,
      py: 1,
      textAlign: 'left',
    }}
  />
)

const DeploymentTable = (props: Props) => {
  const { aliases, deployments } = props

  return (
    <Box
      as="table"
      sx={{
        borderCollapse: 'collapse',
        p: 1,
        width: '100%',
      }}
    >
      <Box
        as="thead"
        sx={{
          fontSize: 0,
          px: 2,
          textTransform: 'uppercase',
        }}
      >
        <tr>
          {/* Deployment */}
          <TH>Deployment</TH>

          {/* State */}
          <TH
            sx={{
              display: ['none', 'table-cell'],
              width: '90px',
            }}
          >
            State
          </TH>

          {/* Branch */}
          <TH
            sx={{
              display: ['none', null, 'table-cell'],
              width: '300px',
            }}
          >
            Branch
          </TH>

          {/* Age */}
          <TH sx={{ width: '100px' }}>Age</TH>

          {/* Creator */}
          <TH sx={{ width: '80px' }}>Creator</TH>
        </tr>
      </Box>
      <tbody>
        {deployments?.map((deployment: Vercel.Deployment) => {
          const alias = aliases?.find(
            alias => alias.deploymentId === deployment.uid
          )

          return (
            <DeploymentRow
              alias={alias}
              deployment={deployment}
              key={deployment.uid}
            />
          )
        })}
      </tbody>
    </Box>
  )
}

export default DeploymentTable
