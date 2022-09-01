import fetch from 'unfetch'
import { assign, Machine } from 'xstate'
import { Vercel } from '../types'

type Context = {
  disabled: boolean
  feedback?: string
  label?: string
  error?: string
}

type Event = { type: 'DEPLOY' }

type Schema = {
  states: {
    idle: {}
    deploying: {}
    success: {}
    error: {}
  }
}

const deployMachine = (deployHook: string) =>
  Machine<Context, Schema, Event>(
    // Machine
    {
      id: 'deploy',
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
            feedback: () => undefined,
            label: () => 'Deploy',
          }),
          on: {
            DEPLOY: 'deploying',
          },
        },
        deploying: {
          entry: assign({
            disabled: () => true,
            label: () => 'Deploying',
          }),
          exit: assign({
            disabled: () => false,
            label: () => 'Deploy',
          }),
          invoke: {
            onDone: {
              target: 'success',
            },
            onError: {
              target: 'error',
              actions: assign({
                error: (_context, event) => {
                  return event.data
                },
              }),
            },
            src: 'deploy',
          },
        },
        success: {
          entry: [assign({ feedback: () => 'Succesfully started!' })],
          exit: assign({
            feedback: () => undefined,
          }),
          on: {
            DEPLOY: 'deploying',
          },
        },
        error: {
          on: {
            DEPLOY: 'deploying',
          },
        },
      },
    },
    // Config
    {
      services: {
        deploy: (): Promise<void> => {
          return new Promise(async (resolve, reject) => {
            try {
              if (!deployHook) {
                return reject(new Error('No deployHook URL defined'))
              }

              const res = await fetch(deployHook, { method: 'POST' })
              const data = await res.json()

              if (!res.ok) {
                const errorMessage =
                  (data?.error as Vercel.Error).message || res.statusText
                return reject(errorMessage)
              }

              return resolve()
            } catch (err) {
              console.error('Unable to deploy with error:', err)
              return reject(
                new Error(
                  'Please check the developer console for more information'
                )
              )
            }
          })
        },
      },
    }
  )

export default deployMachine
