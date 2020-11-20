import fetch from 'unfetch'

import { PluginOptions } from '../types'

const fetcher = (pluginOptions: PluginOptions) => (
  url: string,
  extraParams?: URLSearchParams
) => {
  const params = new URLSearchParams()
  params.set('projectId', pluginOptions.projectId)
  if (pluginOptions.teamId) {
    params.set('teamId', pluginOptions.teamId)
  }

  if (extraParams) {
    for (let [k, v] of extraParams.entries()) {
      params.append(k, v)
    }
  }

  return fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${pluginOptions.token}`,
    },
  }).then(r => r.json())
}

export default fetcher
