import { Vercel } from '@types'
import fetch from 'unfetch'
import { Machine, assign } from 'xstate'

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
            feedback: (_context, _event) => undefined,
            label: (_context, _event) => 'Deploy',
          }),
          on: {
            DEPLOY: 'deploying',
          },
        },
        deploying: {
          entry: assign({
            disabled: (_context, _event) => true,
            label: (_context, _event) => 'Deploying',
          }),
          exit: assign({
            disabled: (_context, _event) => false,
            label: (_context, _event) => 'Deploy',
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
          entry: [
            assign({ feedback: (_context, _event) => 'Succesfully started!' }),
          ],
          exit: assign({
            feedback: (_context, _event) => undefined,
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
                return reject('No deployHook URL defined')
              }

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
              reject('Please check the developer console for more information')
            }

            resolve()
          })
        },
      },
    }
  )

export default deployMachine
