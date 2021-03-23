import { Flex } from '@sanity/ui'
import React from 'react'

import PlaceholderAvatar from '../PlaceholderAvatar'
import PlaceholderText from '../PlaceholderText'
import TableCell from '../TableCell'

const DeploymentPlaceholder = () => {
  return (
    <tr>
      {/* Deployment - alias or regular deployment URL */}
      <TableCell>
        <PlaceholderText rows={1} />
      </TableCell>

      {/* State */}
      <TableCell variant="state">
        <PlaceholderText rows={1} />
      </TableCell>

      {/* Branch */}
      <TableCell variant="branch">
        <PlaceholderText rows={2} />
      </TableCell>

      {/* Age */}
      <TableCell variant="age">
        <PlaceholderText rows={1} />
      </TableCell>

      {/* Creator */}
      <TableCell variant="creator">
        <Flex justify="center">
          <PlaceholderAvatar />
        </Flex>
      </TableCell>
    </tr>
  )
}

export default DeploymentPlaceholder
