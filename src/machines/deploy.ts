import {assign, setup, fromPromise} from 'xstate'
import {Vercel} from '../types'

type Context = {
  deployHook: string
  disabled: boolean
  feedback?: string
  label?: string
  error?: string
}

type Event = {type: 'DEPLOY'}

interface DeployActorInput {
  deployHook: string
}

export const deployMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
    input: {} as DeployActorInput,
  },
  actors: {
    deploy: fromPromise(async ({input, signal}: {input: DeployActorInput; signal: AbortSignal}) => {
      try {
        if (!input.deployHook) {
          throw new Error('No deployHook URL defined')
        }
        const res = await fetch(input.deployHook, {method: 'POST', signal})
        const data = await res.json()
        if (!res.ok) {
          const errorMessage = (data?.error as Vercel.Error).message || res.statusText
          throw errorMessage
        }
      } catch (err) {
        if (typeof err === 'string') {
          throw err
        }
        console.error('Unable to deploy with error:', err)
        throw new Error('Please check the developer console for more information')
      }
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QTABwDYHsCeA6AlhOmAMQAiAogAoAyA8gJoDaADALqKiqaz4Au+TADtOIAB6IATCxa4AnADYAHAHYArArUslAZjksNAGhDZEARk3yVmhSxVyHC-QBYAvq+MoMOXF6zZ8ISgSCGEwAiEAN0wAa3C-HwSAoIRA6IBjAEMBYVY2PNFuXhyRJHFENTMzXElFJSUzNTVnWx0FY1MESXVcZzUdM2k1OTUVBoV3TzR-X2mcQOCwACclzCXcDGyAMzWAW1nvPCSF1KjMLJK8grKi-kFS0AkESura5QamlpY2jvMB+QcDkqLH0wxYEw8ICSuFgAFd0uk4LByNR6Mx2IUeHdhKIns1ZN9BtYQVpRnJfl1JM55P1BnY1Ep9CpGpMoXM8MtVksUbRGNcuFiSriKs4CQNurYRgZ7BSGr1ASNupIzEo+kp3JChJgUPAyklMcV7sKEABadomRAmtQAhW2wE6VnQwjEA3Yh7lBDOSQUsxeqyaPoWYbWFSO9kHfwLV1CspPHSSHQ1ZyA1UKJzJlQ+iz+5oKewKWrfNyQ6FwhFI6NG2OINOSXDiypKAxtMyZi1dEE1Qk6L0FpTSUMl8OctaVnHVhC1+uDRvNhStin6XDaHQ9liSXTJiUa1xAA */
  id: 'deploy',
  initial: 'idle',
  context: ({input}) => ({
    disabled: false,
    feedback: undefined,
    label: undefined,
    error: undefined,
    deployHook: input.deployHook,
  }),
  states: {
    idle: {
      entry: assign({
        feedback: () => undefined,
        label: () => 'Deploy',
      }),
      on: {
        DEPLOY: {
          target: 'deploying',
        },
      },
    },
    deploying: {
      entry: assign({
        disabled: () => true,
        label: () => 'Deploying',
      }),
      exit: assign({
        disabled: () => false,
        label: () => 'Deploy',
      }),
      invoke: {
        src: 'deploy',
        input: ({context}) => ({deployHook: context.deployHook}),
        onDone: {
          target: 'success',
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({event}) => {
              if ('error' in event) {
                return event.error as unknown as string
              }
              return 'Unknown error'
            },
          }),
        },
      },
    },
    success: {
      entry: assign({
        feedback: () => 'Successfully started!',
      }),
      exit: assign({
        feedback: () => undefined,
      }),
      on: {
        DEPLOY: {
          target: 'deploying',
        },
      },
    },
    error: {
      on: {
        DEPLOY: {
          target: 'deploying',
        },
      },
    },
  },
})
