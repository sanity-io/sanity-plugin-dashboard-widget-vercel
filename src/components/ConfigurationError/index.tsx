import React from 'react'
import { Alert, Box, Text } from 'theme-ui'

type Props = {
  error?: string
}

const ConfigurationError = (props: Props) => {
  const { error } = props

  return (
    <Box p={3}>
      <Alert variant="danger">
        <Text mr={1} variant="strong">
          Dashboard configuration error:
        </Text>
        {error}
      </Alert>
    </Box>
  )
}

export default ConfigurationError
