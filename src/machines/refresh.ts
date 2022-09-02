/* eslint-disable */
import { Machine } from 'xstate'

type Context = Record<string, any>

type Event =
  | { type: 'ERROR' }
  | { type: 'REFRESH' }
  | { type: 'REFRESHED' }
  | { type: 'RETRY' }

type Schema = {
  states: {
    idle: Record<string, any>
    refreshing: Record<string, any>
    refreshed: Record<string, any>
    error: Record<string, any>
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
