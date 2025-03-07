import {setup} from 'xstate'

type Event = {type: 'ERROR'} | {type: 'REFRESH'} | {type: 'REFRESHED'} | {type: 'RETRY'}

const refreshMachine = setup({
  types: {
    events: {} as Event,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAJQFEAxBgZQAkBtABgF1FQADgHtYuAC64h+fiAAeiAIwAmAGwkuGrkoAsAZhVKlAVm0KAHABoQAT0QBOJSRN27XFXaMmz2twF9fVmhYeISkAE5gAGYRsCFQ1PS0tADytNx8SCDCohJSMvIIPnYkxhpKXGZ22kY6xla2CAq6CiQudgDsRnYqKroVfe3+gRg4BMQkEdFwcXRMrGz0ACLpMtniktKZBUUlRmUVVTXadTaISrqObUY97QodvWa6QyBBo6ETUTHYkLPM9OwrTJrXKbUDbJTFLjtMzmWraOx3doqeqKMyOeHdXp3BTHXTVZ6vELjMBhMJCMK-eaAwQidZ5LaIY6Q6Gw47wxHI04IGEkDFma5NbTtY7ufwBED4IQQOAyQljIirWkg-KIAC0nIa6oJIyJpHIVEVOQ2KsKShRCDsunUGLcHi8PhU2uC8o+U1iBCghrpoLkZ2uTk0XCq7SRRl0Zg19itXHhIZ85lMEaUTre40mX0gXuVDIQnmKRhZKk6PmaVXN2PUaLsZhj2hUOJU-JTupIJLJYSzxpzeacheLXFL2nNrkrfW8SKFnhDYt8QA */
  initial: 'idle',
  states: {
    idle: {
      on: {
        REFRESH: {
          target: 'refreshing',
        },
      },
    },
    refreshing: {
      on: {
        ERROR: {
          target: 'error',
        },
        REFRESHED: {
          target: 'refreshed',
        },
      },
    },
    refreshed: {
      on: {
        REFRESH: {
          target: 'refreshing',
        },
      },
    },
    error: {
      on: {
        REFRESH: {
          target: 'refreshing',
        },
      },
    },
  },
})

export default refreshMachine
