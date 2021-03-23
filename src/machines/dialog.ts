import { Machine, assign } from 'xstate'
import { Sanity } from '../types'

type Context = {
  editDeploymentTarget?: Sanity.DeploymentTarget
}

type Event =
  | { type: 'CREATE' }
  | { type: 'CLOSE' }
  | { type: 'EDIT'; deploymentTarget: Sanity.DeploymentTarget }

type Schema = {
  states: {
    idle: {}
    edit: {}
    create: {}
  }
}

const dialogMachine = () =>
  Machine<Context, Schema, Event>(
    {
      context: {
        editDeploymentTarget: undefined,
      },
      initial: 'idle',
      states: {
        idle: {
          entry: assign({
            editDeploymentTarget: (_context, _event) => undefined,
          }),
          on: {
            CREATE: 'create',
            EDIT: {
              actions: ['setEditDeploymentTarget'],
              target: 'edit',
            },
          },
        },
        edit: {
          on: {
            CLOSE: 'idle',
          },
        },
        create: {
          on: {
            CLOSE: 'idle',
          },
        },
      },
    },
    {
      actions: {
        setEditDeploymentTarget: assign((_context, event: any) => ({
          editDeploymentTarget: event.deploymentTarget,
        })),
      },
    }
  )

export default dialogMachine
