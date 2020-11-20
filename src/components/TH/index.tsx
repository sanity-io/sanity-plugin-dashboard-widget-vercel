import React from 'react'
import { Box } from 'theme-ui'

const TH = ({ ...props }) => (
  <Box
    {...props}
    as="th"
    sx={{
      borderBottom: '1px solid #eee',
      fontWeight: 'normal',
      px: 3,
      py: 1,
      textAlign: 'left',
      ...props.sx,
    }}
  />
)

export default TH
