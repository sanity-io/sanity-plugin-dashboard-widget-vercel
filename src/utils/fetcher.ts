import fetch from 'unfetch'

import { PluginConfig } from '../types'

// TODO: derive elsewhere?
const LIMIT = 5 // Total number of deploys to retrieve

const fetcher = (config: PluginConfig) => (
  url: string,
  extraParams?: URLSearchParams
) => {
  const params = new URLSearchParams()
  params.set('limit', String(LIMIT))
  params.set('projectId', config.projectId)
  if (config.teamId) {
    params.set('teamId', config.teamId)
  }

  if (extraParams) {
    for (let [k, v] of extraParams.entries()) {
      params.append(k, v)
    }
  }

  return fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
  }).then(r => r.json())
}

export default fetcher
