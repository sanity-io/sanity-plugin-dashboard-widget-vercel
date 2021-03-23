import { Machine, assign } from 'xstate'

type Context = {
  formData?: Record<string, any>
  message: string
}

type Event =
  | { type: 'CREATE' }
  | { type: 'DELETE' }
  | { type: 'REJECT' }
  | { type: 'RESOLVE' }
  | { type: 'SUBMIT' }
  | { type: 'UPDATE' }

type Schema = {
  states: {
    idle: {}
    creating: {}
    updating: {}
    deleting: {}
    success: {}
    error: {}
  }
}

const formMachine = Machine<Context, Schema, Event>(
  {
    context: {
      formData: {},
      message: '',
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          CREATE: {
            actions: ['createDocument'],
            target: 'creating',
          },
          DELETE: {
            actions: ['deleteDocument'],
            target: 'deleting',
          },
          UPDATE: {
            actions: ['updateDocument'],
            target: 'updating',
          },
        },
      },
      creating: {
        invoke: {
          src: 'createDocumentService',
          onDone: { target: 'success' },
          onError: { actions: ['setMessage'], target: 'error' },
        },
        on: {
          RESOLVE: 'success',
          REJECT: 'error',
        },
      },
      updating: {
        invoke: {
          src: 'updateDocumentService',
          onDone: { target: 'success' },
          onError: { actions: ['setMessage'], target: 'error' },
        },
        on: {
          RESOLVE: 'success',
          REJECT: 'error',
        },
      },
      deleting: {
        invoke: {
          src: 'deleteDocumentService',
          onDone: { target: 'success' },
          onError: { actions: ['setMessage'], target: 'error' },
        },
        on: {
          RESOLVE: 'success',
          REJECT: 'error',
        },
      },
      success: {
        invoke: {
          src: 'formSubmittedService',
        },
      },
      error: {},
    },
  },
  {
    actions: {
      setMessage: assign((_context, event: any) => ({
        message: event.data.details.description,
      })),
      createDocument: assign((_context, event: any) => ({
        formData: event.formData,
      })),
      deleteDocument: assign((_context, _event: any) => ({
        // id: event.id,
      })),
      updateDocument: assign((_context, event: any) => ({
        formData: event.formData,
      })),
    },
  }
)

export default formMachine
