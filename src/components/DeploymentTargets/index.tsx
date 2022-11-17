import React from 'react'
import {Stack} from '@sanity/ui'

import DeploymentTarget from '../DeploymentTarget'
import {Sanity} from '../../types'

type Props = {
  items: Sanity.DeploymentTarget[]
  onDialogEdit: (deploymentTarget: Sanity.DeploymentTarget) => void
}

const DeploymentTargets = (props: Props) => {
  const {items, onDialogEdit} = props

  return (
    <Stack space={5}>
      {items?.map((item) => (
        <DeploymentTarget item={item} key={item._id} onDialogEdit={onDialogEdit} />
      ))}
    </Stack>
  )
}

export default DeploymentTargets
