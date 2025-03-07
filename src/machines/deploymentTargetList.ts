import {assign, setup, fromPromise, assertEvent} from 'xstate'
import {Sanity} from '../types'
import type {SanityClient} from 'sanity'
import {DEPLOYMENT_TARGET_DOCUMENT_TYPE} from '../constants'

type Context = {
  client: SanityClient
  results: Sanity.DeploymentTarget[] // TODO: type correctly
}

type Event =
  | {type: 'CLOSE'}
  | {type: 'CREATE'; deploymentTarget: Sanity.DeploymentTarget}
  | {type: 'DELETE'; id: string}
  | {type: 'FETCH'}
  | {type: 'UPDATE'; deploymentTarget: Sanity.DeploymentTarget}

interface Input {
  client: SanityClient
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

export const deploymentTargetListMachine = setup({
  types: {} as {
    children: {fetchData: 'fetch data'}
    context: Context
    events: Event
    input: Input
  },
  actions: {
    targetCreate: assign({
      results: ({context, event}) => {
        assertEvent(event, 'CREATE')
        return sortByTargetName([...context.results, event.deploymentTarget])
      },
    }),
    targetDelete: assign({
      results: ({context, event}) => {
        assertEvent(event, 'DELETE')
        return context.results.filter((target) => target._id !== event.id)
      },
    }),
    targetUpdate: assign({
      results: ({context, event}) => {
        assertEvent(event, 'UPDATE')
        const {deploymentTarget} = event
        const index = context.results.findIndex((target) => target._id === deploymentTarget._id)
        const updatedResults = Object.assign([], context.results, {
          [index]: deploymentTarget,
        })
        return sortByTargetName(updatedResults)
      },
    }),
  },
  guards: {
    hasData: ({context}) => {
      return context?.results?.length > 0
    },
    hasNoData: ({context}) => {
      return context?.results?.length === 0
    },
  },
  actors: {
    'fetch data': fromPromise(
      ({input, signal}: {input: {client: SanityClient}; signal: AbortSignal}) => {
        return input.client
          .fetch<Sanity.DeploymentTarget[]>(
            '*[_type == $type] | order(name asc)',
            {
              type: DEPLOYMENT_TARGET_DOCUMENT_TYPE,
            },
            {signal}
          )
          .catch((error) => {
            if (error instanceof Error && error.name === 'AbortError') {
              return []
            }
            console.error('Failed to fetch deployment targets', error)
            throw error
          })
      }
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcx8ICoBiCAe0JIIDcGBrMEgMzABccAEXT90AbQAMAXUSgyDWLn64mckAA9EAZkkBOEgHYAjAA5DAFgBsFgEwnJAVkMAaEAE9Ep4yUeT-klbGesbaoYaGAL6RbmhYeISkFFQ0tGAATukM6eQANqI82ai8AsKiEjLqCkoqakiaOvpGZpY29sZOrh6IxpYkFo5h2oaOpnqOxraSFtGxGDgExCTpYOgQ7rQAwgBKAKIAggAqu1Ky9dXKqvjqWggWHSS9eoaS9ibao6aObp4IVh8kL56OzGII2PT-WYgOILRLLVbrWhCXYAGV2x1OVUUlzqoFu90kRm8tlM2gsL1eJJ+iEGBj0gVsFm0YWmVkctihMISSxWaw2AFUAApCI4nSrnbG1a71fGSUz9WzBezTFWvb7dO5MkjjMITZykwxjTnzbmkXnrEgAV3wHHwDAA7vhaJiJTUrjces9fFZGc9TLYrGqA9SEM9CcT7sznH5HHpjfFFmaEe4rTa7Y7ncYzvJJe6ZZ7DN7fYaA0GrCHvD4xs4S+yPnGYtCTYn4XySPblNgRGJneKc27cQ0EI4BiQ2T77noAzXyxrTIESGFGd4rP9DONTPHYTzk+3OwxLfxu+he9mQBcpR7h6Px4ylWyIrPfl9bIvJhZJIYA-7zFZoo27QgOB1C5RMsQHaU8UQABaYIQ2gv9G1AuFkmofAoHAnFIKHOwQz0bRtUMcd-j8WwpnuLdTVbdZMMvfMEFsPQQxMeViQmZkLC+f0oiQ5s4XNFNrVtB1sIvPMoIQCIK1BIsmXXWxtFJcZKJbAS934Ltylo8ShysfDHl9PRxjlekrC6Z9BhIBk5MkXpzFBFT+N3DsNIPI8tNdLCr20L0Wmscw5V0e5pMJYwBiI8kwrDRC5gTOEeHQXBckgbTB1uZwQw6RwrEBd9bEcQZYzsRDoiAA */
  context: ({input}) => ({
    client: input.client,
    results: [],
  }),
  initial: 'pending',
  states: {
    pending: {
      invoke: {
        src: 'fetch data',
        id: 'fetchData',
        input: ({context}) => ({client: context.client}),
        onDone: {
          actions: assign({results: ({event}) => event.output}),
          target: 'ready',
        },
        onError: {
          target: 'failed',
        },
      },
    },
    ready: {
      initial: 'unknown',
      on: {
        CREATE: {
          actions: 'targetCreate',
        },
        DELETE: {
          actions: 'targetDelete',
        },
        UPDATE: {
          actions: 'targetUpdate',
        },
      },
      states: {
        unknown: {
          always: [
            {target: 'withData', guard: 'hasData'},
            {target: 'withoutData', guard: 'hasNoData'},
          ],
        },
        withData: {
          always: [{target: 'withoutData', guard: 'hasNoData'}],
        },
        withoutData: {
          always: [{target: 'withData', guard: 'hasData'}],
        },
      },
    },
    failed: {
      type: 'final',
    },
  },
})
