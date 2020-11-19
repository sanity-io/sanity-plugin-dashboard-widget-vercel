import { Machine, assign, send, spawn } from 'xstate'

// TODO: understand why using the @types paths alias is not respected here
import { PluginConfig, PluginConfigRuntype } from '../types'
import deployMachine from './deploy'
import refreshMachine from './refresh'

// TODO: type correctly
type Context = {
  config?: PluginConfig
  lastDeployTime?: number
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

const mainMachine = (config: PluginConfig) =>
  Machine<Context, Schema, Event>(
    {
      context: {
        config,
        lastDeployTime: undefined,
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
            onError: 'error',
          },
        },
        error: {
          type: 'final',
        },
        ready: {
          states: {
            deploy: {
              entry: assign({
                refDeploy: () => spawn(deployMachine(config)),
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
        // Validate sanity plugin config
        checkConfig: context => {
          const { config } = context

          return new Promise((resolve, reject) => {
            try {
              PluginConfigRuntype.check(config)
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
