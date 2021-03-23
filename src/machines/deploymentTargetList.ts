import { Sanity } from '@types'
import { Machine, assign } from 'xstate'

type Context = {
  message: string
  results: Sanity.DeploymentTarget[] // TODO: type correctly
}

type Event =
  | { type: 'CLOSE' }
  | { type: 'CREATE'; deploymentTarget: Sanity.DeploymentTarget }
  | { type: 'DELETE'; id: string }
  | { type: 'FETCH' }
  | { type: 'REJECT'; message: string }
  | { type: 'RESOLVE'; results: any[] }
  | { type: 'UPDATE' }

type Schema = {
  states: {
    failed: {}
    pending: {}
    ready: {
      states: {
        unknown: {}
        withData: {}
        withoutData: {}
      }
    }
  }
}

const sortByTargetName = (items: Sanity.DeploymentTarget[]) => {
  return items.sort((a, b) => {
    if (a.name > b.name) {
      return 1
    }

    if (a.name < b.name) {
      return -1
    }

    return 0
  })
}

const deploymentTargetListMachine = () =>
  Machine<Context, Schema, Event>(
    {
      context: {
        message: '',
        results: [],
      },
      initial: 'pending',
      states: {
        pending: {
          invoke: {
            src: 'fetchDataService',
            onDone: { actions: ['setResults'], target: 'ready' },
            onError: { actions: ['setMessage'], target: 'failed' },
          },
        },
        ready: {
          initial: 'unknown',
          on: {
            CREATE: { actions: ['targetCreate'] },
            DELETE: { actions: ['targetDelete'] },
            UPDATE: { actions: ['targetUpdate'] },
          },
          states: {
            unknown: {
              always: [
                { cond: 'hasData', target: 'withData' },
                { target: 'withoutData' },
              ],
            },
            withData: {},
            withoutData: {},
          },
        },
        failed: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        setMessage: assign((_context, event: any) => ({
          message: event.data.details.description,
        })),
        setResults: assign((_context, event: any) => ({
          results: event.data,
        })),
        targetCreate: assign((context, event: any) => ({
          results: sortByTargetName([
            ...context.results,
            event.deploymentTarget,
          ]),
        })),
        targetDelete: assign((context, event: any) => ({
          results: context.results.filter(target => target._id !== event.id),
        })),
        targetUpdate: assign((context, event: any) => {
          const { deploymentTarget } = event
          const index = context.results.findIndex(
            target => target._id === deploymentTarget._id
          )
          const updatedResults = Object.assign([], context.results, {
            [index]: event.deploymentTarget,
          })

          return {
            results: sortByTargetName(updatedResults),
          }
        }),
      },
      guards: {
        hasData: context => {
          return context?.results?.length > 0
        },
      },
    }
  )

export default deploymentTargetListMachine
