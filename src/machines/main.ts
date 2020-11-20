import { Machine, assign, send, spawn } from 'xstate'

// TODO: understand why using the @types paths alias is not respected here
import { PluginOptions, PluginOptionsRuntype } from '../types'
import deployMachine from './deploy'
import refreshMachine from './refresh'

// TODO: type correctly
type Context = {
  error?: string
  lastDeployTime?: number
  pluginOptions?: PluginOptions
  refDeploy: any
  refRefresh: any
}

type Event = { type: 'DEPLOYED' }

type Schema = {
  states: {
    error: {}
    idle: {}
    ready: {}
  }
}

const mainMachine = (pluginOptions: PluginOptions) =>
  Machine<Context, Schema, Event>(
    {
      context: {
        lastDeployTime: undefined,
        pluginOptions,
        refDeploy: undefined,
        refRefresh: undefined,
      },
      initial: 'idle',
      on: {
        DEPLOYED: {
          actions: [
            assign({
              lastDeployTime: (context, event) => new Date().getTime(),
            }),
            send('REFRESH', {
              to: context => context.refRefresh,
            }),
          ],
        },
      },
      states: {
        idle: {
          invoke: {
            src: 'checkConfig',
            onDone: 'ready',
            onError: {
              actions: assign({
                error: (context, event) => event.data.message,
              }),
              target: 'error',
            },
          },
        },
        error: {
          type: 'final',
        },
        ready: {
          states: {
            deploy: {
              entry: assign({
                refDeploy: () => spawn(deployMachine(pluginOptions)),
              }),
            },
            refresh: {
              entry: assign({
                refRefresh: () => spawn(refreshMachine),
              }),
            },
          },
          type: 'parallel',
        },
      },
    },
    {
      services: {
        // Validate sanity plugin options
        checkConfig: context => {
          const { pluginOptions } = context

          return new Promise((resolve, reject) => {
            try {
              PluginOptionsRuntype.check(pluginOptions)
              resolve()
            } catch (err) {
              reject(err)
            }
          })
        },
      },
    }
  )

export default mainMachine
