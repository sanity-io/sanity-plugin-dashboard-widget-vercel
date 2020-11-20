import fetch from 'unfetch'

import { PluginConfig } from '../types'

const fetcher = (config: PluginConfig) => (
  url: string,
  extraParams?: URLSearchParams
) => {
  const params = new URLSearchParams()
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
