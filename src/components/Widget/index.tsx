import * as RunTypes from 'runtypes'
import { Vercel } from '@types'
import React from 'react'
import useSWR from 'swr'
import { Box, ThemeProvider } from 'theme-ui'

import theme from '../../styled/theme'
import fetcher from '../../utils/fetcher'
import DeploymentTable from '../DeploymentTable'
import DeployButton from '../DeployButton'
import styles from './index.css'

// https://vercel.com/docs/platform/limits

const API_ENDPOINT_DEPLOYMENTS = 'https://api.vercel.com/v5/now/deployments'
const API_ENDPOINT_ALIASES = 'https://api.vercel.com/v3/now/aliases'
const LIMIT = 5 // Total number of deploys to retrieve
const SWR_OPTIONS = {
  loadingTimeout: 3000,
  refreshInterval: 10000, // ms
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
}

type Props = {
  config: PluginConfig
}

// Create type with `runtypes`
export const PluginConfigType = RunTypes.Record({
  deployHook: RunTypes.String,
  projectId: RunTypes.String,
  teamId: RunTypes.String.Or(RunTypes.Undefined),
  token: RunTypes.String,
})

// TypeScript defintion
export type PluginConfig = RunTypes.Static<typeof PluginConfigType>

const getParams = (config: PluginConfig): string => {
  const params = new URLSearchParams()
  params.set('limit', String(LIMIT))
  params.set('projectId', config.projectId)
  if (config.teamId) {
    params.set('teamId', config.teamId)
  }
  return params.toString()
}

const Widget = (props: Props) => {
  const { config } = props

  // State
  // const [error, setError] = useState<string | null>(null)

  // Validate plugin config
  try {
    PluginConfigType.check(config)
  } catch (err) {
    console.error(err.message)
    return <div>Invalid config: {err.message}</div>
  }

  // Fetch project aliases and deployments
  const {
    data: resultAliases,
    // error: errorAliases
  } = useSWR(
    `${API_ENDPOINT_ALIASES}?${getParams(config)}`,
    fetcher(config.token),
    {
      ...SWR_OPTIONS,
    }
  )
  const {
    data: resultDeployments,
    // error: errorDeployments
  } = useSWR(
    `${API_ENDPOINT_DEPLOYMENTS}?${getParams(config)}`,
    fetcher(config.token),
    {
      ...SWR_OPTIONS,
      onError: () => {
        // console.log('onError()')
      },
      onLoadingSlow: () => {
        // console.log('onLoadingSlow()')
      },
      onSuccess: () => {
        // console.log('onSuccess()')
      },
    }
  )

  const aliases = resultAliases?.aliases as Vercel.Alias[]
  const deployments = resultDeployments?.deployments as Vercel.Deployment[]

  // console.log('config', config)
  // console.log('deployments', deployments)

  return (
    <ThemeProvider theme={theme}>
      <Box className={styles.container} color="text">
        <header className={styles.header}>
          <h2 className={styles.title}>Vercel Status</h2>
        </header>

        {/* Error */}
        {/* {error && <div>An error has occurred: {error}</div>} */}

        {/* Content */}
        <Box>
          <DeploymentTable aliases={aliases} deployments={deployments} />
        </Box>

        {/* Footer */}
        {config.deployHook && (
          <div className={styles.footer}>
            <DeployButton deployHook={config.deployHook} />
          </div>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default Widget
