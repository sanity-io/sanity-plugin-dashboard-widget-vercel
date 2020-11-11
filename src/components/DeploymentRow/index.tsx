import { Deployment } from '@types'
import React, { useRef } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Box, Flex, Image } from 'theme-ui'

import StatusDot from '../StatusDot'

type Props = {
  deployment: Deployment
}

const TD = ({ ...props }) => (
  <Box
    as="td"
    {...props}
    sx={{
      ...props.sx,
      // bg: '#fafafa',
      borderBottom: '1px solid #eee',
      fontSize: 1,
      // height: '45px',
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
  const { deployment } = props

  const date = useRef(new Date(deployment.created))

  const commitMessage = deployment?.meta?.githubCommitMessage
  const commitRef = deployment?.meta?.githubCommitRef

  return (
    <tr>
      {/* Deployment */}
      <TD>
        <SingleLine>
          {deployment.url ? (
            <a
              href={`https://${deployment.url}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {deployment.url}
            </a>
          ) : (
            'Uploading...'
          )}
        </SingleLine>
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
        <SingleLine color="gray">{commitMessage || <>&nbsp;</>}</SingleLine>
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
