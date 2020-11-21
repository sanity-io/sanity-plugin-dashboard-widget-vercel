import { ReturnDownForward } from '@emotion-icons/ionicons-solid'
import { Vercel } from '@types'
import React, { useRef } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Box, Flex, Image, Link } from 'theme-ui'

import TD from '../TD'
import StatusDot from '../StatusDot'

type Props = {
  deployment: Vercel.DeploymentWithAlias
}

const Deployment = (props: Props) => {
  const { deployment } = props

  const date = useRef(new Date(deployment.created))

  const commitMessage = deployment?.meta?.githubCommitMessage
  const commitRef = deployment?.meta?.githubCommitRef

  const targetUrl = deployment.alias ?? deployment.url

  return (
    <tr>
      {/* Deployment - alias or regular deployment URL */}
      <TD>
        <Flex sx={{ alignItems: 'center' }}>
          <StatusDot
            state={deployment.state}
            sx={{
              flexShrink: 0,
              mr: 2,
            }}
            variant="statusDot.smallOnly"
          />

          {targetUrl ? (
            <Flex
              sx={{
                alignItems: 'center',
              }}
            >
              {/* Alias icon */}
              {deployment.alias && (
                <ReturnDownForward size="12px" style={{ flexShrink: 0 }} />
              )}

              <Box ml={deployment.alias ? 1 : 0} variant="singleLine">
                {deployment.state === 'READY' ? (
                  <Link
                    href={`https://${targetUrl}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {targetUrl}
                  </Link>
                ) : (
                  <Box
                    color="muted"
                    sx={{
                      textDecoration:
                        deployment.state === 'CANCELED' ||
                        deployment.state === 'ERROR'
                          ? 'line-through'
                          : 'normal',
                    }}
                  >
                    {targetUrl}
                  </Box>
                )}
              </Box>
            </Flex>
          ) : (
            <Box color="muted">Uploading...</Box>
          )}
        </Flex>
      </TD>

      {/* State */}
      <TD variant="cells.state">
        <Flex sx={{ alignItems: 'center' }}>
          <StatusDot state={deployment.state} variant="statusDot.default" />
          <Box ml="7px">
            {deployment.state
              .trim()
              .toLowerCase()
              .replace(/^[a-z]/i, t => t.toUpperCase())}
          </Box>
        </Flex>
      </TD>

      {/* Branch */}
      <TD variant="cells.branch">
        <Box variant="singleLine">{commitRef}</Box>
        {commitMessage && (
          <Box color="muted" variant="singleLine">
            {commitMessage}
          </Box>
        )}
      </TD>

      {/* Age */}
      <TD variant="cells.age">
        <Box variant="singleLine">
          <ReactTimeAgo date={date.current} locale="en-US" timeStyle="mini" />
        </Box>
      </TD>

      {/* Creator */}
      <TD variant="cells.creator">
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            size: '100%',
            top: 0,
          }}
        >
          <Image
            src={`https://vercel.com/api/www/avatar/${deployment?.creator?.uid}?&s=48`}
            variant="avatar"
          />
        </Flex>
      </TD>
    </tr>
  )
}

export default Deployment
