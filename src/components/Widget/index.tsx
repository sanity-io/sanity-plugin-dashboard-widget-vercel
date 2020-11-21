import { PluginOptions } from '@types'
import { useMachine } from '@xstate/react'
import React from 'react'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { Box, ThemeProvider } from 'theme-ui'

import mainMachine from '../../machines/main'
import theme from '../../styled/theme'
import ConfigurationError from '../ConfigurationError'
import Deployments from '../Deployments'
import DeployButton from '../DeployButton'
import styles from './index.css'

const queryCache = new QueryCache()

const Widget = (pluginOptions: PluginOptions) => {
  // xstate: Initialise main machine, passing plugin options
  const [state] = useMachine(mainMachine(pluginOptions))

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider
        theme={theme({
          forceSmallLayout: pluginOptions?.forceSmallLayout,
        })}
      >
        <Box className={styles.container} color="text">
          <header className={styles.header}>
            <h2 className={styles.title}>Vercel Status</h2>
          </header>

          {/* Error */}
          {state.matches('error') && (
            <ConfigurationError error={state.context.error} />
          )}

          {/* Ready */}
          {state.matches('ready') && (
            <>
              {/* Content */}
              <Deployments
                actor={state.context.refRefresh}
                lastDeployTime={state.context.lastDeployTime}
                pluginOptions={pluginOptions}
              />

              {/* Footer / deploy button */}
              {pluginOptions.deployHook && (
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
