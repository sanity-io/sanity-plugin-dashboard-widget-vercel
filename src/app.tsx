import {AddIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Text, ToastProvider, Tooltip} from '@sanity/ui'
import {useMachine} from '@xstate/react'
import React from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import StateDebug from './components/StateDebug'
import {Z_INDEX_TOAST_PROVIDER} from './constants'
import {deploymentTargetListMachine} from './machines/deploymentTargetList'
import DeploymentTargets from './components/DeploymentTargets'
import DialogForm from './components/DialogForm'
import {dialogMachine} from './machines/dialog'
import {Sanity} from './types'
import {useSanityClient} from './client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      staleTime: 0,
    },
  },
})

const Widget = () => {
  const client = useSanityClient()

  const [deploymentTargetListState, deploymentTargetListStateTransition] = useMachine(
    deploymentTargetListMachine,
    {input: {client}}
  )
  const [dialogState, dialogStateTransition] = useMachine(dialogMachine)

  // Callbacks
  const handleDialogClose = () => {
    dialogStateTransition({type: 'CLOSE'})
  }
  const handleDialogShowCreate = () => {
    dialogStateTransition({type: 'CREATE'})
  }
  const handleDialogShowEdit = (deploymentTarget: Sanity.DeploymentTarget) => {
    dialogStateTransition({type: 'EDIT', deploymentTarget})
  }
  const handleTargetCreate = (deploymentTarget: Sanity.DeploymentTarget) => {
    deploymentTargetListStateTransition({type: 'CREATE', deploymentTarget})
  }
  const handleTargetDelete = (id: string) => {
    deploymentTargetListStateTransition({type: 'DELETE', id})
  }
  const handleTargetUpdate = (deploymentTarget: Sanity.DeploymentTarget) => {
    deploymentTargetListStateTransition({type: 'UPDATE', deploymentTarget})
  }

  return (
    <ToastProvider zOffset={Z_INDEX_TOAST_PROVIDER}>
      <QueryClientProvider client={queryClient}>
        <Card radius={2} style={{overflow: 'hidden '}}>
          {/* xstate debug */}
          <StateDebug name="List" state={deploymentTargetListState} />

          {/* Header */}
          <Flex align="center" justify="space-between" paddingX={3} paddingY={2}>
            <Text size={5} weight="semibold">
              Vercel deployments
            </Text>

            <Tooltip
              content={
                <Box padding={2}>
                  <Text muted size={1}>
                    Create new deployment target
                  </Text>
                </Box>
              }
              placement="left"
            >
              <Button fontSize={1} icon={AddIcon} onClick={handleDialogShowCreate} mode="bleed" />
            </Tooltip>
          </Flex>

          <Box>
            {deploymentTargetListState.matches('pending') && (
              <Box paddingX={3} paddingY={4}>
                <Text>Loading...</Text>
              </Box>
            )}

            {deploymentTargetListState.matches({ready: 'withoutData'}) && (
              <Box paddingX={3} paddingY={4}>
                <Text>
                  No deployment targets found.{' '}
                  <a onClick={handleDialogShowCreate} style={{cursor: 'pointer'}}>
                    Create a new target?
                  </a>
                </Text>
              </Box>
            )}

            {deploymentTargetListState.matches({ready: 'withData'}) && (
              <DeploymentTargets
                items={deploymentTargetListState.context.results}
                onDialogEdit={handleDialogShowEdit}
              />
            )}

            {deploymentTargetListState.matches('failed') && (
              <Box paddingX={3} paddingY={4}>
                <Text>
                  Failed to retrieve deployment targets. Please check the developer console log for
                  more information.
                </Text>
              </Box>
            )}
          </Box>
        </Card>

        {/* Dialogs */}
        {dialogState.matches('create') && (
          <DialogForm onClose={handleDialogClose} onCreate={handleTargetCreate} />
        )}

        {dialogState.matches('edit') && (
          <DialogForm
            deploymentTarget={dialogState.context.editDeploymentTarget}
            onClose={handleDialogClose}
            onDelete={handleTargetDelete}
            onUpdate={handleTargetUpdate}
          />
        )}
      </QueryClientProvider>
    </ToastProvider>
  )
}

export default Widget
