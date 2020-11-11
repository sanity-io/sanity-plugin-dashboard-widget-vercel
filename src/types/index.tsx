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

  export type Error = {
    code: string
    message: string
  }
}
