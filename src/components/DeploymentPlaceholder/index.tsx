import React from 'react'
import { Box, Flex } from 'theme-ui'

import TD from '../TD'

const DeploymentPlaceholder = () => {
  return (
    <tr>
      {/* Deployment - alias or regular deployment URL */}
      <TD>
        <Box variant="skeleton.text">
          <br />
        </Box>
      </TD>

      {/* State */}
      <TD variant="cells.state">
        <Box variant="skeleton.text">
          <br />
        </Box>
      </TD>

      {/* Branch */}
      <TD variant="cells.branch">
        <Box variant="skeleton.text">
          <br />
          <br />
        </Box>
      </TD>

      {/* Age */}
      <TD variant="cells.age">
        <Box variant="skeleton.text">
          <br />
        </Box>
      </TD>

      {/* Creator */}
      <TD variant="cells.creator">
        <Flex sx={{ justifyContent: 'center' }}>
          <Box variant="skeleton.avatar">
            <br />
          </Box>
        </Flex>
      </TD>
    </tr>
  )
}

export default DeploymentPlaceholder
