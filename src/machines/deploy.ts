/* eslint-disable */
import fetch from 'unfetch'
import { Machine, assign } from 'xstate'
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
    idle: Record<string, any>
    deploying: Record<any, any>
    success: Record<string, any>
    error: Record<string, any>
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
            disabled: () => true,
            label: () => 'Deploying',
          }) as any,
          exit: assign({
            disabled: () => false,
            label: () => 'Deploy',
          }) as any,
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
          entry: [assign({ feedback: () => 'Succesfully started!' })] as any,
          exit: assign({
            feedback: () => undefined,
          }) as any,
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
          // eslint-disable-next-line no-async-promise-executor
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
