import * as Runtypes from 'runtypes'

export declare namespace Vercel {
  export type Alias = {
    alias: string
    deploymentId: string
  }

  export type DeploymentState = 'BUILDING' | 'ERROR' | 'QUEUED' | 'READY'

  export type Deployment = {
    created: number
    createdAt: number
    creator: {
      uid: string
    }
    instanceCount: number
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

// Create type with `runtypes`
export const PluginConfigRuntype = Runtypes.Record({
  deployHook: Runtypes.String,
  projectId: Runtypes.String,
  teamId: Runtypes.String.Or(Runtypes.Undefined),
  token: Runtypes.String,
})

// Generate TypeScript defintion from `RunTypes` derived type
export type PluginConfig = Runtypes.Static<typeof PluginConfigRuntype>
