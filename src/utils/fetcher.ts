import {Sanity} from '../types'

const fetcher =
  (deploymentTarget: Sanity.DeploymentTarget) =>
  async (url: string, extraParams?: URLSearchParams) => {
    const params = new URLSearchParams()
    params.set('projectId', deploymentTarget.projectId)
    if (deploymentTarget.teamId) {
      params.set('teamId', deploymentTarget.teamId)
    }

    if (extraParams) {
      for (const [k, v] of extraParams.entries()) {
        params.append(k, v)
      }
    }

    const response = await fetch(`${url}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${deploymentTarget.token}`,
      },
    })

    // Manually throw on non-OK responses for react-query
    // https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-others-clients-that-do-not-throw-by-default
    if (!response.ok) {
      throw new Error('Response not OK')
    }

    try {
      return response.json()
    } catch (err) {
      throw new Error(err as string)
    }
  }

export default fetcher
