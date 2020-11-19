import { useActor } from '@xstate/react'
import AnchorButton from 'part:@sanity/components/buttons/anchor'
import Snackbar from 'part:@sanity/components/snackbar/default'
import React from 'react'
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
      {state.value === 'success' && (
        <Snackbar
          kind="success"
          title={<strong>Deploy started</strong>}
          timeout={8000}
        />
      )}

      {/* Error */}
      {state.value === 'failure' && (
        <Snackbar
          kind="error"
          subtitle={state.context.error}
          title={<strong>Deploy failed</strong>}
          timeout={8000}
        />
      )}
    </>
  )
}

export default DeployButton
