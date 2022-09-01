import type { SanityDocument } from '@sanity/client'

export declare namespace Sanity {
  export type BoxDisplay =
    | 'none'
    | 'block'
    | 'grid'
    | 'flex'
    | 'inline-block'
    | 'table-cell'

  export type DeploymentTarget = SanityDocument & {
    deployHook: string
    deployLimit: number
    name: string
    projectId: string
    teamId?: string
    token: string
  }
}
export declare namespace Vercel {
  export type Alias = {
    alias: string
    deploymentId: string
  }

  export type DeploymentState =
    | 'BUILDING'
    | 'CANCELED'
    | 'ERROR'
    | 'QUEUED'
    | 'READY'

  export type Deployment = {
    aliasAssigned?: number
    aliasError?: any // TODO: correctly type
    created: number
    createdAt: number
    creator: {
      email: string
      uid: string
      username: string
    }
    meta?: Record<string, any>
    state: DeploymentState
    target: string
    uid: string
    url: string | null // null if a deployment is still uploading
  }

  export type DeploymentWithAlias = Vercel.Deployment & {
    alias?: string
  }

  // https://vercel.com/docs/api#api-basics/errors
  export type Error = {
    code: string
    message: string
  }
}
