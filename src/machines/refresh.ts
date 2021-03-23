import { Machine } from 'xstate'

type Context = {}

type Event =
  | { type: 'ERROR' }
  | { type: 'REFRESH' }
  | { type: 'REFRESHED' }
  | { type: 'RETRY' }

type Schema = {
  states: {
    idle: {}
    refreshing: {}
    refreshed: {}
    error: {}
  }
}

const refreshMachine = Machine<Context, Schema, Event>({
  initial: 'idle',
  states: {
    idle: {
      on: {
        REFRESH: 'refreshing',
      },
    },
    refreshing: {
      on: {
        ERROR: 'error',
        REFRESHED: 'refreshed',
      },
    },
    refreshed: {
      on: {
        REFRESH: 'refreshing',
      },
    },
    error: {
      on: {
        REFRESH: 'refreshing',
      },
    },
  },
})

export default refreshMachine
