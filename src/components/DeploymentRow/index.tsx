import { ReturnDownForward } from '@emotion-icons/ionicons-solid'
import { Vercel } from '@types'
import React, { useRef } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Styled } from 'theme-ui'
import { Box, Flex, Image, Link } from 'theme-ui'

import StatusDot from '../StatusDot'

type Props = {
  alias?: Vercel.Alias
  deployment: Vercel.Deployment
}

const TD = ({ ...props }) => (
  <Box
    as="td"
    {...props}
    sx={{
      ...props.sx,
      borderBottom: '1px solid #eee',
      fontSize: 1,
      lineHeight: 'body',
      px: 3,
      py: 2,
      // verticalAlign: 'top',
    }}
  />
)

const SingleLine = ({ ...props }) => (
  <Box
    {...props}
    sx={{
      ...props.sx,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
  />
)

const DeploymentRow = (props: Props) => {
  const { alias, deployment } = props

  const date = useRef(new Date(deployment.created))

  const commitMessage = deployment?.meta?.githubCommitMessage
  const commitRef = deployment?.meta?.githubCommitRef

  console.log('alias', alias)

  return (
    <tr>
      {/* Deployment - alias or regular deployment URL */}
      <TD>
        <Flex sx={{ alignItems: 'center' }}>
          <Box sx={{ display: ['block', 'none'], mr: '7px' }}>
            <StatusDot state={deployment.state} />
          </Box>

          <SingleLine>
            {alias ? (
              <Flex
                sx={{
                  alignItems: 'center',
                }}
              >
                <ReturnDownForward size="12px" />
                <Box ml={1}>
                  <Link
                    href={`https://${alias.alias}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {alias.alias}
                  </Link>
                </Box>
              </Flex>
            ) : deployment.url ? (
              <Link
                href={`https://${deployment.url}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {deployment.url}
              </Link>
            ) : (
              'Uploading...'
            )}
          </SingleLine>
        </Flex>
      </TD>

      {/* State */}
      <TD
        sx={{
          display: ['none', 'table-cell'],
        }}
      >
        <Flex sx={{ alignItems: 'center' }}>
          <StatusDot state={deployment.state} />
          <Box ml="7px">
            {deployment.state
              .trim()
              .toLowerCase()
              .replace(/^[a-z]/i, t => t.toUpperCase())}
          </Box>
        </Flex>
      </TD>

      {/* Branch */}
      <TD
        sx={{
          display: ['none', null, 'table-cell'],
        }}
      >
        {commitRef}
        <br />
        <SingleLine color="muted">{commitMessage || <>&nbsp;</>}</SingleLine>
      </TD>

      {/* Age */}
      <TD>
        <ReactTimeAgo date={date.current} locale="en-US" timeStyle="mini" /> ago
      </TD>

      {/* Creator */}
      <TD
        sx={{
          position: 'relative',
        }}
      >
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

export default DeploymentRow
