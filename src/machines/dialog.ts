import {assertEvent, assign, setup} from 'xstate'
import {Sanity} from '../types'

type Context = {
  editDeploymentTarget?: Sanity.DeploymentTarget
}

type Event =
  | {type: 'CREATE'}
  | {type: 'CLOSE'}
  | {type: 'EDIT'; deploymentTarget: Sanity.DeploymentTarget}

export const dialogMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  actions: {
    setEditDeploymentTarget: assign({
      editDeploymentTarget: ({event}) => {
        assertEvent(event, 'EDIT')
        return event.deploymentTarget
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAYQCUBRAQQBVGBtABgF1FQADgHtYuAC64h+fiAAeiAEwKArCQCcANgAcAdmUbNOhVx0BGLQBoQAT0SmAzApJcXXexoAsW5fbWaFAL4BVmhYeISk5FTUjAAiAJKs3HxIIMKiElIy8ghKqpq6+obGZpY2ivb2zq4e5moeXKZc3kEhGDgExCSQ4nQAMgDyAMqcvDLp4pLSqTn2DSQefn7uyq5aWvZWtgjmTqsuvnU6XMoK9q0goR0RJJgATmDoYjS0gyPJ4yKTWTOIc1wLJZqFZrDZbRBaUwkfZuew6SFcepuILBED4IQQOAyK7hYifDJTbKIAC0GnBCFJFxxnUilDA+O+01AOQ8CnJGxIGn29lMpjUxhcCh0VPauNIPTEDMyTLkiA8PhIxh5Cg8DS8pgM5L5UOalSMah0cP05hFYRptweT3pqQm0qJCHlVSVphVashmvKCDUAN17j0XNMqrUyhRASAA */
  context: {
    editDeploymentTarget: undefined,
  },
  initial: 'idle',
  states: {
    idle: {
      entry: assign({
        editDeploymentTarget: () => undefined,
      }),
      on: {
        CREATE: {
          target: 'create',
        },
        EDIT: {
          actions: 'setEditDeploymentTarget',
          target: 'edit',
        },
      },
    },
    edit: {
      on: {
        CLOSE: {
          target: 'idle',
        },
      },
    },
    create: {
      on: {
        CLOSE: {
          target: 'idle',
        },
      },
    },
  },
})
