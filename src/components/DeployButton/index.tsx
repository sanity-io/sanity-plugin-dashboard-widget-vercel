import { useActor } from '@xstate/react'
import AnchorButton from 'part:@sanity/components/buttons/anchor'
import Snackbar from 'part:@sanity/components/snackbar/default'
import React from 'react'

import { WIDGET_NAME } from '../../constants'
// import StateDebug from '../StateDebug'

type Props = {
  // TODO: type correctly
  actor: any
}

const DeployButton = (props: Props) => {
  const { actor } = props

  const [state, send] = useActor(actor)

  const handleDeploy = () => {
    send({ type: 'DEPLOY' })
  }

  return (
    <>
      <AnchorButton
        color="primary"
        disabled={state.context.disabled}
        kind="simple"
        onClick={handleDeploy}
      >
        {/* xstate debug */}
        {/* <StateDebug machineId={actor.machine.id} state={state} /> */}

        {state.context.label}
      </AnchorButton>

      {/* Success */}
      {state.matches('success') && (
        <Snackbar
          kind="success"
          subtitle="Deploy queued"
          title={<strong>{WIDGET_NAME}</strong>}
          timeout={8000}
        />
      )}

      {/* Error */}
      {state.matches('error') && (
        <Snackbar
          kind="error"
          subtitle={`Unable to queue deploy: ${state.context.error}`}
          title={<strong>{WIDGET_NAME}</strong>}
          timeout={8000}
        />
      )}
    </>
  )
}

export default DeployButton
