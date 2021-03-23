import { UploadIcon } from '@sanity/icons'
import { Box, Button, useToast } from '@sanity/ui'
import { useMachine } from '@xstate/react'
import React, { useEffect } from 'react'

import { WIDGET_NAME } from '../../constants'
import deployMachine from '../../machines/deploy'
import StateDebug from '../StateDebug'

type Props = {
  deployHook: string
  onDeploySuccess?: () => void
  targetName: string
}

const DeployButton = (props: Props) => {
  const { deployHook, onDeploySuccess, targetName } = props

  const [
    deployState,
    deployStateTransition,
    deployStateInterpreter,
  ] = useMachine(deployMachine(deployHook))

  const toast = useToast()

  const isError = deployState.matches('error')
  const isSuccess = deployState.matches('success')

  // Callbacks
  const handleDeploy = () => {
    deployStateTransition({ type: 'DEPLOY' })
  }

  // Effects
  useEffect(() => {
    if (isError) {
      toast.push({
        closable: true,
        description: `Unable to queue deploy for ${targetName}: ${deployState.context.error}`,
        duration: 8000,
        status: 'error',
        title: WIDGET_NAME,
      })
    }

    if (isSuccess) {
      toast.push({
        closable: true,
        description: `Deploy queued for ${targetName}`,
        duration: 8000,
        status: 'success',
        title: WIDGET_NAME,
      })
    }
  }, [isError, isSuccess])

  useEffect(() => {
    deployStateInterpreter.onTransition(state => {
      if (state.value === 'success') {
        if (onDeploySuccess) {
          onDeploySuccess()
        }
      }
    })
  }, [deployStateInterpreter])

  return (
    <Box padding={3} style={{ position: 'relative' }}>
      {/* xstate debug */}
      <StateDebug name="Deploy" state={deployState} />

      <Button
        disabled={deployState.context.disabled}
        fontSize={1}
        icon={UploadIcon}
        mode="ghost"
        onClick={handleDeploy}
        padding={3}
        text={`${deployState.context.label} ${targetName}`}
        tone="default"
      />
    </Box>
  )
}

export default DeployButton
