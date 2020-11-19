import { PluginConfig, Vercel } from '@types'
import fetch from 'unfetch'
import { Machine, assign, sendParent } from 'xstate'

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
    failure: {}
  }
}

const deployMachine = (config: PluginConfig) =>
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
          entry: [
            assign({
              feedback: (context, event) => 'Succesfully started!',
            }),
            sendParent('DEPLOYED', { delay: 4000 }),
          ],
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
    },
    // Config
    {
      services: {
        deploy: () => {
          return new Promise(async (resolve, reject) => {
            try {
              const res = await fetch(config.deployHook, { method: 'POST' })
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
    }
  )

export default deployMachine
