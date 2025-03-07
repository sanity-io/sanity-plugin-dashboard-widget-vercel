import type {SanityClient} from 'sanity'
import {uuid} from '@sanity/uuid'
import {assertEvent, assign, fromPromise, setup} from 'xstate'
import type {Sanity} from '../types'
import {DEPLOYMENT_TARGET_DOCUMENT_TYPE} from '../constants'

type Context = {
  client: SanityClient
  document?: Sanity.DeploymentTarget
  id?: string
  formData?: Record<string, any>
  message: string
}

type Event =
  | {type: 'CREATE'; formData: Record<string, any>}
  | {type: 'UPDATE'; id: string; formData: Record<string, any>}
  | {type: 'DELETE'; id: string}

interface Input {
  client: SanityClient
}

export const formMachine = setup({
  types: {} as {
    children: {
      createDocumentActor: 'create document'
      updateDocumentActor: 'update document'
      deleteDocumentActor: 'delete document'
    }
    context: Context
    events: Event
    input: Input
    tags: 'busy'
  },
  actions: {
    setId: assign({
      id: ({event}) => {
        assertEvent(event, ['UPDATE', 'DELETE'])
        return event.id
      },
    }),
    setFormData: assign({
      formData: ({event}) => {
        assertEvent(event, ['CREATE', 'UPDATE'])
        return event.formData
      },
    }),
    setMessage: assign({
      message: ({event}) => {
        if (
          'data' in event &&
          event.data &&
          typeof event.data === 'object' &&
          'details' in event.data &&
          event.data.details &&
          typeof event.data.details === 'object' &&
          'description' in event.data.details
        ) {
          return event.data.details.description as string
        }
        return 'An error occurred'
      },
    }),
    setDocument: assign({
      document: ({event}) => {
        // @ts-expect-error - fix typings later
        return event.output
      },
    }),
  },
  actors: {
    'create document': fromPromise(
      ({input}: {input: Required<Pick<Context, 'client' | 'formData'>>}) => {
        return input.client.create({
          _id: `vercel.${uuid()}`,
          _type: DEPLOYMENT_TARGET_DOCUMENT_TYPE,
          ...input.formData,
        })
      }
    ),
    'update document': fromPromise(
      ({input}: {input: Required<Pick<Context, 'client' | 'id' | 'formData'>>}) => {
        return input.client.patch(input.id).set(input.formData).commit()
      }
    ),
    'delete document': fromPromise(({input}: {input: Required<Pick<Context, 'client' | 'id'>>}) => {
      return input.client.delete(input.id)
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAYQCUBRAQQBVGBtABgF1FQADgHtYuAC64h+fiAAeiAIwBmAGwkuGjQFYALAE4AHACYdWgwYA0IAJ6IjKgOwkdXFUYVa9h-Ua5KAvv5WaFh4hKTkVNQAqgAKACJsnLwywqISUjLyCMpqmtr6xqbmVrYIBgokWvlGWkpaCgZeKoHBGDgExGSUNPGMADKM7Nx8SCBp4pLSY9m56vm6hiZmljaIOipqdXpcDk1aWiYqBlqtICEd4SSYAE5g6BL4UNQQUmBk+ABuQgDW77f3MRgeJCTAAV1QYHwYmYmDEQhuI1SIkmmRmiGOShIDiUOh0SiaCgUegcDj0pTsjhI5iMewUpPsTSMZwuYS6AIeBGeYBuNwRJAEFAeADMEahrncHsDQRCoTC4QikWMJhlpqBspjsbj8YTiaTyWsEKouNT6noiX5zUpiQEgud2mzSGCBBBOU8Xm8Pt8-iRna6gSDwZDobD4YiUsqUaqshiDFicXiCea9WSKeVKiSVIclEYlIY-BUWQ7Ok6XW7ubz+YKRWLfWWAzLg-Kw0rBFGpjGEJqEzrkyTU4b6ToSHojHos7VXEc6kXQiWSBAwFRHs9XoQvb93ovl9Kg3LQ4qI230h30V241rE7r+wayro1A4dO4VHotA5fPTTnbWfPt2AV9QPJ8jcApCmIoo3OKf4NnuIYKuGozHqiapyLG8bakmRI3mmpjxk0XAuEoXAHI+DgtGc+BCIu8BjD+4TIieaLqogAC0Khpmxs6XF0kRgAxyGdk+aYKLSVR7Fweg6A4IkGFwChcY6EqAly-HRmeY7DnSY5GHGL4qFwRhpjpJpmriDjVMRLgGAp84ckCECqaezEIHoObUuZuwKH4xGPgoRnmCQpmOAcqhmPJ37Flcfrlo5TGoQgY4mgYHkeAS+iqH5hqSc4dSuCo+I6SoSjvjZUX1pAsUodkrlGO51TSd5b46JlZRebVuG7IcjRmA05FtHOVzQSpkaMVVdivs4CibHGxg6biSg4ZsJD2AccaFEVGwOKVXTQRVI0CWeNV1Z5jW+WmujDj4HjmMRnhEttpBAQilWdkdyX1V5RFNS1iAEpU1pHER9JWjogSBEAA */
  context: ({input}) => ({
    client: input.client,
    formData: {},
    message: '',
  }),
  initial: 'idle',
  states: {
    idle: {
      on: {
        CREATE: {
          actions: ['setFormData'],
          target: 'creating',
        },
        UPDATE: {
          actions: ['setId', 'setFormData'],
          target: 'updating',
        },
        DELETE: {
          actions: 'setId',
          target: 'deleting',
        },
      },
    },
    creating: {
      tags: ['busy'],
      invoke: {
        src: 'create document',
        id: 'createDocumentActor',
        input: ({context}) => ({client: context.client, formData: context.formData!}),
        onDone: {actions: 'setDocument', target: 'created'},
        onError: {actions: 'setMessage', target: 'error'},
      },
    },
    created: {type: 'final'},
    updating: {
      tags: ['busy'],
      invoke: {
        src: 'update document',
        id: 'updateDocumentActor',
        input: ({context}) => ({
          client: context.client,
          id: context.id!,
          formData: context.formData!,
        }),
        onDone: {actions: 'setDocument', target: 'updated'},
        onError: {actions: 'setMessage', target: 'error'},
      },
    },
    updated: {type: 'final'},
    deleting: {
      tags: ['busy'],
      invoke: {
        src: 'delete document',
        id: 'deleteDocumentActor',
        input: ({context}) => ({client: context.client, id: context.id!}),
        onDone: {target: 'deleted'},
        onError: {actions: 'setMessage', target: 'error'},
      },
    },
    deleted: {type: 'final'},
    error: {type: 'final'},
  },
})
