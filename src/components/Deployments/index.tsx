import { PluginConfig } from '@types'
import { useActor } from '@xstate/react'
import React, { useEffect } from 'react'
import { useQueryCache } from 'react-query'
import { Box } from 'theme-ui'

import useDeployments from '../../hooks/useDeployments'
import Deployment from '../Deployment'
// import StateDebug from '../StateDebug'

type Props = {
  // TODO: type correctly
  actor: any
  config: PluginConfig
  lastDeployTime?: number
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

const Deployments = (props: Props) => {
  const { actor, config } = props

  // Xstate
  const [state, send] = useActor(actor)

  // Fetch deployments
  const { deployments, error, isFetching, isSuccess } = useDeployments(config)

  const cache = useQueryCache()

  // Invalidate all react-query queries / force re-fetch on `refreshing` state
  useEffect(() => {
    if (state.matches('refreshing')) {
      cache.invalidateQueries()
    }
  }, [state.value])

  useEffect(() => {
    if (error) {
      console.error('error:', error)
      send({ type: 'ERROR' })
    }

    if (isFetching) {
      send({ type: 'REFRESH' })
    }

    if (!isFetching && isSuccess) {
      send({ type: 'REFRESHED' })
    }
  }, [error, isFetching, isSuccess])

  return (
    <>
      {/* xstate debug */}
      {/* <StateDebug machineId={actor.machine.id} state={state} /> */}

      <Box
        as="table"
        sx={{
          borderCollapse: 'collapse',
          p: 1,
          tableLayout: 'fixed',
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
          {deployments?.map(deployment => {
            return <Deployment deployment={deployment} key={deployment.uid} />
          })}
        </tbody>
      </Box>
    </>
  )
}

export default Deployments
