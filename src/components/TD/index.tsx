import React from 'react'
import { Box } from 'theme-ui'

const TD = ({ ...props }) => (
  <Box
    {...props}
    as="td"
    sx={{
      borderBottom: '1px solid #eee',
      flexGrow: 1,
      lineHeight: 'body',
      position: 'relative',
      px: 3,
      py: 2,
      ...props.sx,
    }}
  />
)

export default TD
