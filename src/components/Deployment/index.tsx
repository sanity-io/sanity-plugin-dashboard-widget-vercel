import { Box, Flex, Stack, Text } from '@sanity/ui'
import React, { useRef } from 'react'
import ReactTimeAgo from 'react-time-ago'

import TableCell from '../TableCell'
import StatusDot from '../StatusDot'
import { LinkIcon } from '@sanity/icons'
import { Vercel } from '../../types'

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
      <TableCell>
        <Flex align="center">
          <Box
            display={['block', 'block', 'block', 'block', 'none']}
            marginRight={3}
            style={{ flexShrink: 0 }}
          >
            <StatusDot state={deployment.state} />
          </Box>

          {targetUrl ? (
            <>
              {/* Alias icon */}
              {deployment.alias && <LinkIcon />}

              <Box marginLeft={deployment.alias ? 1 : 0}>
                <Text
                  muted={!(deployment.state === 'READY')}
                  size={1}
                  style={{
                    textDecoration:
                      deployment.state === 'CANCELED' ||
                      deployment.state === 'ERROR'
                        ? 'line-through'
                        : 'normal',
                  }}
                  textOverflow="ellipsis"
                >
                  {deployment.state === 'READY' ? (
                    <a
                      href={`https://${targetUrl}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {targetUrl}
                    </a>
                  ) : (
                    targetUrl
                  )}
                </Text>
              </Box>
            </>
          ) : (
            <Text size={1}>Uploading...</Text>
          )}
        </Flex>
      </TableCell>

      {/* State */}
      <TableCell variant="state">
        <Flex align="center">
          <StatusDot state={deployment.state} />
          <Box marginLeft={2}>
            <Text size={1}>
              {deployment.state
                .trim()
                .toLowerCase()
                .replace(/^[a-z]/i, t => t.toUpperCase())}
            </Text>
          </Box>
        </Flex>
      </TableCell>

      {/* Branch */}
      <TableCell variant="branch">
        <Stack space={2}>
          <Text size={1} textOverflow="ellipsis">
            {commitRef}
          </Text>
          {commitMessage && (
            <Text muted size={1} textOverflow="ellipsis">
              {commitMessage}
            </Text>
          )}
        </Stack>
      </TableCell>

      {/* Age */}
      <TableCell variant="age">
        <Flex align="center">
          <Text size={1}>
            <ReactTimeAgo date={date.current} locale="en-US" timeStyle="mini" />
          </Text>
        </Flex>
      </TableCell>

      {/* Creator */}
      <TableCell variant="creator">
        <Flex align="center" justify="center">
          <img
            draggable={false}
            src={`https://vercel.com/api/www/avatar/${deployment?.creator?.uid}?&s=48`}
            style={{
              borderRadius: '20px',
              height: '20px',
              width: '20px',
            }}
          />
        </Flex>
      </TableCell>
    </tr>
  )
}

export default Deployment
