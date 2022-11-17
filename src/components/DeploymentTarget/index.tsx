import {EditIcon} from '@sanity/icons'
import {Box, Button, Flex, Text, Tooltip} from '@sanity/ui'
import React, {FC} from 'react'

import Deployments from '../Deployments'
import {Sanity} from '../../types'

type Props = {
  item: Sanity.DeploymentTarget
  onDialogEdit: (deploymentTarget: Sanity.DeploymentTarget) => void
}

const DeploymentTarget: FC<Props> = (props: Props) => {
  const {item, onDialogEdit} = props

  const deploymentTarget = {
    deployHook: item.deployHook,
    deployLimit: item.deployLimit,
    name: item.name,
    projectId: item.projectId,
    teamId: item.teamId,
    token: item.token,
  } as Sanity.DeploymentTarget

  return (
    <Box style={{position: 'relative'}}>
      {/* Header */}
      <Flex align="center" justify="space-between" marginTop={2} paddingX={3}>
        <Text size={2}>{item.name}</Text>

        <Tooltip
          content={
            <Box padding={2}>
              <Text muted size={1}>
                Edit deployment target
              </Text>
            </Box>
          }
          placement="left"
        >
          <Button fontSize={1} icon={EditIcon} mode="bleed" onClick={() => onDialogEdit(item)} />
        </Tooltip>
      </Flex>

      {/* Content */}
      <Deployments deploymentTarget={deploymentTarget} />
    </Box>
  )
}

export default DeploymentTarget
