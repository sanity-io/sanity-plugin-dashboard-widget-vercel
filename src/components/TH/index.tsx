import React from 'react'
import { Box } from 'theme-ui'

const TH = ({ ...props }) => (
  <Box
    {...props}
    as="th"
    sx={{
      fontWeight: 'normal',
      overflow: 'hidden',
      px: 3,
      py: 1,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'left',
      ...props.sx,
    }}
  />
)

export default TH
