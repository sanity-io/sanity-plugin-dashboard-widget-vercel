import { PluginConfig } from '@types'
import { useActor } from '@xstate/react'
import Snackbar from 'part:@sanity/components/snackbar/default'
import React, { useEffect } from 'react'
import { useQueryCache } from 'react-query'
import { Box } from 'theme-ui'

import { DEPLOY_LIMIT, WIDGET_NAME } from '../../constants'
import useDeployments from '../../hooks/useDeployments'
import Deployment from '../Deployment'
import DeploymentPlaceholder from '../DeploymentPlaceholder'
// import StateDebug from '../StateDebug'
import TD from '../TD'
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

  // Fetch deployments - disable hook / auto-refetching on error state
  const { deployments, error, isFetching, isSuccess } = useDeployments(config, {
    enabled: !state.matches('error'),
  })

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
          {deployments ? (
            deployments.length > 0 ? (
              deployments.map(deployment => (
                <Deployment deployment={deployment} key={deployment.uid} />
              ))
            ) : (
              <tr>
                <TD colSpan={5}>No deployments</TD>
              </tr>
            )
          ) : (
            new Array(DEPLOY_LIMIT)
              .fill(undefined)
              .map((_, index) => <DeploymentPlaceholder key={index} />)
          )}
        </Box>
      </Box>

      {/* Error */}
      {state.matches('error') && (
        <Snackbar
          kind="error"
          subtitle="Unable to fetch deployments"
          title={<strong>{WIDGET_NAME}</strong>}
          timeout={8000}
        />
      )}
    </>
  )
}

export default Deployments
