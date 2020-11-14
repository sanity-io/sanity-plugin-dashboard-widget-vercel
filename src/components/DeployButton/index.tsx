import { useMachine } from '@xstate/react'
import AnchorButton from 'part:@sanity/components/buttons/anchor'
import Snackbar from 'part:@sanity/components/snackbar/default'
import React from 'react'
import fetch from 'unfetch'
import { Machine, assign } from 'xstate'
import { Vercel } from '../../types'

type DeployContext = {
  disabled: boolean
  feedback?: string
  label?: string
  error?: string
}

type DeployEvent = { type: 'DEPLOY' }

type DeploySchema = {
  states: {
    idle: {}
    deploying: {}
    success: {}
    failure: {}
  }
}

const deployMachine = Machine<DeployContext, DeploySchema, DeployEvent>(
  // Machine
  {
    id: 'toggle',
    initial: 'idle',
    context: {
      disabled: false,
      feedback: undefined,
      label: undefined,
      error: undefined,
    },
    states: {
      idle: {
        entry: assign({
          feedback: (context, event) => undefined,
          label: (context, event) => 'Deploy',
        }),
        on: {
          DEPLOY: 'deploying',
        },
      },
      deploying: {
        entry: assign({
          disabled: (context, event) => true,
          label: (context, event) => 'Deploying',
        }),
        exit: assign({
          disabled: (context, event) => false,
          label: (context, event) => 'Deploy',
        }),
        invoke: {
          onDone: {
            target: 'success',
          },
          onError: {
            target: 'failure',
            actions: assign({
              error: (context, event) => {
                return event.data
              },
            }),
          },
          src: 'deploy',
        },
      },
      success: {
        entry: assign({
          feedback: (context, event) => 'Succesfully started!',
        }),
        exit: assign({
          feedback: (context, event) => undefined,
        }),
        on: {
          DEPLOY: 'deploying',
        },
      },
      failure: {
        on: {
          DEPLOY: 'deploying',
        },
      },
    },
  }
)

type Props = {
  deployHook: string
}

const DeployButton = (props: Props) => {
  const { deployHook } = props

  const [state, send] = useMachine(deployMachine, {
    // Config
    services: {
      deploy: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await fetch(deployHook, { method: 'POST' })
            const data = await res.json()

            if (!res.ok) {
              const errorMessage =
                (data?.error as Vercel.Error).message || res.statusText
              reject(errorMessage)
            }

            resolve()
          } catch (err) {
            console.error('Unable to deploy with error:', err)
            reject('Please check your console for errors')
          }

          resolve()
        })
      },
    },
  })

  const handleDeploy = () => {
    send('DEPLOY')
  }

  return (
    <>
      <AnchorButton
        color="primary"
        disabled={state.context.disabled}
        kind="simple"
        onClick={handleDeploy}
      >
        {state.context.label}
      </AnchorButton>

      {state.value === 'success' && (
        <Snackbar
          kind="success"
          title={<strong>Deploy started</strong>}
          timeout={8000}
        />
      )}

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
