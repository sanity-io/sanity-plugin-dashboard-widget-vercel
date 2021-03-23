import { Box, Text, useToast } from '@sanity/ui'
import { Sanity } from '@types'
import { useMachine } from '@xstate/react'
import React, { useEffect, useRef } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { WIDGET_NAME } from '../../constants'
import useDeployments from '../../hooks/useDeployments'
import refreshMachine from '../../machines/refresh'
import Deployment from '../Deployment'
import DeployButton from '../DeployButton'
import DeploymentPlaceholder from '../DeploymentPlaceholder'
import StateDebug from '../StateDebug'
import TableCell from '../TableCell'

type Props = {
  deploymentTarget: Sanity.DeploymentTarget
}

const Deployments = (props: Props) => {
  const { deploymentTarget } = props

  // Refs
  const refTimeout = useRef<ReturnType<typeof setTimeout>>()

  // XState
  const [refreshState, refreshStateTransition] = useMachine(refreshMachine)

  // Fetch deployments - disable hook / auto-refetching on error state
  const { deployments, error, isFetching, isSuccess, refetch } = useDeployments(
    deploymentTarget,
    {
      enabled: !refreshState.matches('error'),
    }
  )

  const toast = useToast()
  const isError = refreshState.matches('error')

  const handleDeploySuccess = () => {
    if (refTimeout.current) {
      clearTimeout(refTimeout.current)
    }
    refTimeout.current = setTimeout(() => {
      refetch({
        cancelRefetch: true,
        throwOnError: true,
      })
    }, 4000)
  }

  useEffect(() => {
    return () => {
      if (refTimeout.current) {
        clearTimeout(refTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    if (error) {
      refreshStateTransition({ type: 'ERROR' })
    }

    if (isFetching) {
      refreshStateTransition({ type: 'REFRESH' })
    }

    if (!isFetching && isSuccess) {
      refreshStateTransition({ type: 'REFRESHED' })
    }
  }, [error, isFetching, isSuccess])

  useDeepCompareEffect(() => {
    if (!refreshState.matches('refreshing')) {
      refreshStateTransition({ type: 'REFRESH' })
    }
  }, [deploymentTarget])

  useDeepCompareEffect(() => {
    if (isError) {
      toast.push({
        closable: true,
        description: `Unable to fetch deployments for ${deploymentTarget.name}`,
        duration: 8000,
        status: 'error',
        title: WIDGET_NAME,
      })
    }
  }, [deploymentTarget, isError])

  const hasFetched = typeof deployments !== 'undefined'
  const hasDeployments = deployments && deployments.length > 0

  return (
    <Box marginTop={3} style={{ position: 'relative' }}>
      {/* xstate debug */}
      <StateDebug name="Refresh" state={refreshState} />

      {!refreshState.matches('error') && (
        <>
          <Box
            as="table"
            style={{
              borderBottom: '1px solid #eee',
              borderCollapse: 'collapse',
              display: 'table',
              tableLayout: 'fixed',
              width: '100%',
            }}
          >
            <Box as="thead" style={{ display: 'table-header-group' }}>
              <tr>
                {/* Deployment */}
                <TableCell header>Deployment</TableCell>

                {/* State */}
                <TableCell header variant="state">
                  State
                </TableCell>

                {/* Branch */}
                <TableCell header variant="branch">
                  Branch
                </TableCell>

                {/* Age */}
                <TableCell header variant="age">
                  Age
                </TableCell>

                {/* Creator */}
                <TableCell header variant="age">
                  Creator
                </TableCell>
              </tr>
            </Box>

            <Box as="tbody" style={{ display: 'table-header-group' }}>
              {/* Placeholders */}
              {!deployments &&
                new Array(deploymentTarget?.deployLimit)
                  .fill(undefined)
                  .map((_, index) => <DeploymentPlaceholder key={index} />)}
              {/* Deployments */}
              {hasDeployments &&
                deployments?.map(deployment => (
                  <Deployment deployment={deployment} key={deployment.uid} />
                ))}
            </Box>
          </Box>

          {/* No results */}
          {hasFetched && !hasDeployments && (
            <Box padding={3} style={{ width: '100%' }}>
              <Text muted size={1}>
                No deployments found. Don't forget to specify a valid team ID if
                your project belongs to a team.
              </Text>
            </Box>
          )}
        </>
      )}

      {/* Error message */}
      {refreshState.matches('error') && (
        <Box padding={3}>
          <Text muted size={1}>
            Unable to fetch recent deployments. Please check your network and
            deployment settings.
          </Text>
        </Box>
      )}

      {/* Deploy button */}
      {!refreshState.matches('error') && deploymentTarget.deployHook && (
        <Box>
          <DeployButton
            deployHook={deploymentTarget.deployHook}
            onDeploySuccess={handleDeploySuccess}
          />
        </Box>
      )}
    </Box>
  )
}

export default Deployments
