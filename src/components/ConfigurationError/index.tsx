import React from 'react'
import { Box, Message, Text } from 'theme-ui'

type Props = {
  error?: string
}

const ConfigurationError = (props: Props) => {
  const { error } = props

  return (
    <Box p={3}>
      <Message variant="danger">
        <Text mr={1} variant="strong">
          Plugin configuration error:
        </Text>
        {error}
      </Message>
    </Box>
  )
}

export default ConfigurationError
