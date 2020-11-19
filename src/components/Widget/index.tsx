import { PluginConfig } from '@types'
import { useMachine } from '@xstate/react'
import React from 'react'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { Box, ThemeProvider } from 'theme-ui'

import mainMachine from '../../machines/main'
import theme from '../../styled/theme'
import Deployments from '../Deployments'
import DeployButton from '../DeployButton'
import styles from './index.css'

type Props = {
  config: PluginConfig
}

const queryCache = new QueryCache()

const Widget = (props: Props) => {
  const { config } = props

  // xstate: Initialise main machine, passing plugin config
  const [state] = useMachine(mainMachine(config))

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={theme}>
        <Box className={styles.container} color="text">
          {/* Error */}
          {state.matches('error') && <Box>(Configuration error)</Box>}

          {/* Ready */}
          {state.matches('ready') && (
            <>
              <header className={styles.header}>
                <h2 className={styles.title}>Vercel Status</h2>
              </header>

              {/* Content */}
              <Deployments
                actor={state.context.refRefresh}
                config={config}
                lastDeployTime={state.context.lastDeployTime}
              />

              {/* Footer */}
              {config.deployHook && (
                <div className={styles.footer}>
                  <DeployButton actor={state.context.refDeploy} />
                </div>
              )}
            </>
          )}
        </Box>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  )
}

export default Widget
