import { PluginConfig, Vercel } from '@types'
import { useQuery } from 'react-query'

import fetcher from '../utils/fetcher'

// https://vercel.com/docs/platform/limits

const API_ENDPOINT_DEPLOYMENTS = 'https://api.vercel.com/v5/now/deployments'
const API_ENDPOINT_ALIASES = 'https://api.vercel.com/v3/now/aliases'

const useDeployments = (config: PluginConfig) => {
  const fetchUrl = fetcher(config)

  // Fetch deployments
  const {
    data: deploymentsData,
    isFetching: deploymentsIsFetching,
    isSuccess: deploymentsIsSuccess,
    error: deploymentsError,
  } = useQuery('deployments', () => fetchUrl(API_ENDPOINT_DEPLOYMENTS), {
    refetchInterval: 15000, // ms
    refetchOnMount: true,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: true,
  })

  // Fetch aliases (only if deployments have been retrieved)
  const {
    data: aliasesData,
    isFetching: aliasesIsFetching,
    isSuccess: aliasesIsSuccess,
    error: aliasesError,
  } = useQuery('aliases', () => fetchUrl(API_ENDPOINT_ALIASES), {
    enabled: deploymentsData,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const aliases = aliasesData?.aliases as Vercel.Alias[]

  const deployments: Vercel.DeploymentWithAlias[] = deploymentsData?.deployments.reduce(
    (acc: Vercel.DeploymentWithAlias[], val: Vercel.Deployment) => {
      if (!aliases) {
        return acc
      }

      const alias = aliases.find(alias => alias.deploymentId === val.uid)
      acc.push({
        ...val,
        alias: alias?.alias,
      })

      return acc
    },
    []
  )

  return {
    deployments,
    error: aliasesError || deploymentsError,
    isFetching: aliasesIsFetching || deploymentsIsFetching,
    isSuccess: aliasesIsSuccess && deploymentsIsSuccess,
  }
}

export default useDeployments
