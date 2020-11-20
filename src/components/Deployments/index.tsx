import { PluginConfig } from '@types'
import { useActor } from '@xstate/react'
import React, { useEffect } from 'react'
import { useQueryCache } from 'react-query'
import { Box } from 'theme-ui'

import useDeployments from '../../hooks/useDeployments'
import Deployment from '../Deployment'
// import StateDebug from '../StateDebug'
import TH from '../TH'

type Props = {
  // TODO: type correctly
  actor: any
  config: PluginConfig
  lastDeployTime?: number
}

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
            textTransform: 'uppercase',
          }}
        >
          <tr>
            {/* Deployment */}
            <TH>Deployment</TH>

            {/* State */}
            <TH variant="cells.state">State</TH>

            {/* Branch */}
            <TH variant="cells.branch">Branch</TH>

            {/* Age */}
            <TH variant="cells.age">Age</TH>

            {/* Creator */}
            <TH variant="cells.creator">Creator</TH>
          </tr>
        </Box>
        <Box
          as="tbody"
          sx={{
            fontSize: 1,
          }}
        >
          {deployments?.map(deployment => {
            return <Deployment deployment={deployment} key={deployment.uid} />
          })}
        </Box>
      </Box>
    </>
  )
}

export default Deployments
