import AnchorButton from 'part:@sanity/components/buttons/anchor'
import { Vercel } from '@types'
import React, { useState } from 'react'
import useSWR from 'swr'
import { Box, Button, ThemeProvider } from 'theme-ui'

import theme from '../../styled/theme'
import fetcher from '../../utils/fetcher'
import styles from './index.css'
import DeploymentTable from '../DeploymentTable'

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

const params = new URLSearchParams()
params.set('limit', String(LIMIT))
if (process.env.SANITY_STUDIO_VERCEL_PROJECT_ID) {
  params.set('projectId', String(process.env.SANITY_STUDIO_VERCEL_PROJECT_ID))
}

const Widget = () => {
  // State
  // const [deploying, setDeploying] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  // const [jobId, setJobId] = useState(null)

  // Fetch project aliases and deployments
  const { data: resultAliases, error: errorAliases } = useSWR(
    `${API_ENDPOINT_ALIASES}?${params.toString()}`,
    fetcher,
    {
      ...SWR_OPTIONS,
    }
  )
  const { data: resultDeployments, error: errorDeployments } = useSWR(
    `${API_ENDPOINT_DEPLOYMENTS}?${params.toString()}`,
    fetcher,
    {
      ...SWR_OPTIONS,
      onError: () => {
        console.log('onError()')
      },
      onLoadingSlow: () => {
        console.log('onLoadingSlow()')
      },
      onSuccess: () => {
        console.log('onSuccess()')
      },
    }
  )

  const aliases = resultAliases?.aliases as Vercel.Alias[]
  const deployments = resultDeployments?.deployments as Vercel.Deployment[]

  // Callbacks
  /*
  const handleDeploy = () => {
    setDeploying(true)

    // https://vercel.com/docs/v2/more/deploy-hooks?query=deploy%20hoo#triggering-a-deploy-hook
    fetch(process.env.SANITY_STUDIO_VERCEL_DEPLOY_HOOK, {method: 'POST'})
      .then(res => res.json())
      .then(json => {
        setJobId(json.job.id)
        updateList()
      })
  }
  */

  return (
    <ThemeProvider theme={theme}>
      <Box className={styles.container} color="text">
        <header className={styles.header}>
          <h2 className={styles.title}>Vercel Status</h2>
        </header>

        {/* Error */}
        {/* {error && <div>An error has occurred: {error}</div>} */}

        {/* Content */}
        <DeploymentTable aliases={aliases} deployments={deployments} />

        {/* Footer */}
        <div className={styles.footer}>
          {/*
          <AnchorButton
            className={styles.button}
            color="primary"
            // disabled={deploying}
            kind="simple"
            // onClick={handleDeploy}
          >
            {deploying ? 'Deploying...' : 'Deploy'}
          </AnchorButton>
          */}
          <Button>Deploy</Button>
        </div>
      </Box>
    </ThemeProvider>
  )
}

export default Widget
