// import AnchorButton from 'part:@sanity/components/buttons/anchor'
import { Deployment } from '@types'
import React, { useState, useEffect } from 'react'
import fetch from 'node-fetch'
import { ThemeProvider } from 'theme-ui'

import theme from '../../styled/theme'
import styles from './index.css'
import DeploymentTable from '../DeploymentTable'

type VercelError = {
  code: string
  message: string
}

const API_ENDPOINT = 'https://api.vercel.com/v5/now/deployments'

const Widget = () => {
  // State
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobId, setJobId] = useState(null)
  const [deployments, setDeployments] = useState<Deployment[]>()

  // https://vercel.com/docs/platform/limits

  const updateList = async () => {
    console.log('updateList()')
    console.log(process.env.SANITY_STUDIO_VERCEL_TOKEN)
    console.log(process.env.SANITY_STUDIO_VERCEL_PROJECT_ID)

    // https://vercel.com/docs/api?query=api#endpoints/deployments/list-deployments

    try {
      const params = new URLSearchParams()
      params.set('limit', '7')

      if (process.env.SANITY_STUDIO_VERCEL_PROJECT_ID) {
        params.set(
          'projectId',
          String(process.env.SANITY_STUDIO_VERCEL_PROJECT_ID)
        )
      }

      console.log('> params.toString()', params.toString())

      const res = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${process.env.SANITY_STUDIO_VERCEL_TOKEN}`,
        },
      })
      const json = await res.json()

      if (json.error) {
        console.log('json.error', json.error)
        setError((json.error as VercelError).message)
      }

      console.log('json', json)

      setDeployments(json.deployments)
    } catch (err) {
      //
    }
  }

  useEffect(() => {
    updateList()
  }, []) // update the list initially

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
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Vercel Status</h2>
        </header>

        {/* Error */}
        {error && <div>An error has occurred: {error}</div>}

        {/* Content */}
        <DeploymentTable deployments={deployments} />

        {/* Footer */}
        {/*
      <div className={styles.footer}>
        <AnchorButton
          className={styles.button}
          color="primary"
          disabled={deploying}
          kind="simple"
          onClick={handleDeploy}
        >
          {deploying ? 'Deploying...' : 'Deploy'}
        </AnchorButton>
      </div>
      */}
      </div>
    </ThemeProvider>
  )
}

export default Widget
