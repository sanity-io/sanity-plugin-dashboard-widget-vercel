import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Dialog, Flex, Stack } from '@sanity/ui'
import { Sanity } from '@types'
import { useMachine } from '@xstate/react'
import client from 'part:@sanity/base/client'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  DEPLOYMENT_TARGET_DOCUMENT_TYPE,
  Z_INDEX_DIALOG,
} from '../../constants'
import formMachine from '../../machines/form'
import sanitizeFormData from '../../utils/sanitizeFormData'
import FormFieldInputText from '../FormFieldInputText'

type Props = {
  deploymentTarget?: Sanity.DeploymentTarget
  onClose: () => void
  onCreate?: (deploymentTarget: Sanity.DeploymentTarget) => void
  onDelete?: (id: string) => void
  onUpdate?: (deploymentTarget: Sanity.DeploymentTarget) => void
}

type FormData = yup.InferType<typeof formSchema>

const formSchema = yup.object().shape({
  deployHook: yup.string().url('Deploy hook must be a valid URL'),
  deployLimit: yup
    .number()
    .positive()
    .integer()
    .min(1, 'Deploy limit must no less than 1')
    .max(15, 'Deploy limit must no higher than 15')
    .typeError('Deploy limit must be a number')
    .required('Deploy limit must be a positive integer between 1 and 15'),
  name: yup.string().required('Name cannot be empty'),
  projectId: yup.string().required('Vercel Project ID cannot be empty'),
  teamId: yup.string(),
  token: yup.string().required('Vercel Account Token cannot be empty'),
})

const DialogForm: FC<Props> = (props: Props) => {
  const { deploymentTarget, onClose, onCreate, onDelete, onUpdate } = props

  // xstate
  const [formState, formStateTransition] = useMachine(formMachine, {
    services: {
      formSubmittedService: async () => {
        onClose()
      },
      // TODO: refactor
      createDocumentService: async (_context, event: any) => {
        let document
        try {
          document = await client.create({
            _type: DEPLOYMENT_TARGET_DOCUMENT_TYPE,
            ...event.formData,
          })
          if (onCreate) {
            onCreate(document)
          }
          return Promise.resolve()
        } catch (e) {
          return Promise.reject(e)
        }
      },
      // TODO: refactor
      deleteDocumentService: async () => {
        if (deploymentTarget) {
          try {
            await client.delete(deploymentTarget._id)
            if (onDelete) {
              onDelete(deploymentTarget._id)
            }
            return Promise.resolve()
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      // TODO: refactor
      updateDocumentService: async (_context, event: any) => {
        let document
        if (deploymentTarget) {
          try {
            document = await client
              .patch(deploymentTarget._id)
              .set(event.formData)
              .commit()
            if (onUpdate) {
              onUpdate(document)
            }
            return Promise.resolve()
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
    },
  })

  const formUpdating =
    formState.matches('creating') ||
    formState.matches('deleting') ||
    formState.matches('updating')

  // react-hook-form
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      deployHook: deploymentTarget?.deployHook || '',
      deployLimit: deploymentTarget?.deployLimit || 5,
      name: deploymentTarget?.name,
      projectId: deploymentTarget?.projectId,
      teamId: deploymentTarget?.teamId || '',
      token: deploymentTarget?.token,
    },
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  })

  // Callbacks
  // - submit react-hook-form
  const onSubmit = async (formData: FormData) => {
    const sanitizedFormData = sanitizeFormData(formData)
    formStateTransition(deploymentTarget ? 'UPDATE' : 'CREATE', {
      formData: sanitizedFormData,
    })
  }

  const handleDelete = () => {
    formStateTransition('DELETE', { id: deploymentTarget?._id })
  }

  const Footer = () => (
    <Box padding={3}>
      <Flex justify={deploymentTarget ? 'space-between' : 'flex-end'}>
        {/* Delete button */}
        {deploymentTarget && (
          <Button
            disabled={formUpdating}
            fontSize={1}
            mode="bleed"
            onClick={handleDelete}
            text="Delete"
            tone="critical"
          />
        )}

        {/* Submit button */}
        <Button
          disabled={formUpdating || !isDirty || !isValid}
          fontSize={1}
          onClick={handleSubmit(onSubmit)}
          text={deploymentTarget ? 'Update and close' : 'Create'}
          tone="primary"
        />
      </Flex>
    </Box>
  )

  return (
    <Dialog
      footer={<Footer />}
      header={`${deploymentTarget ? 'Edit' : 'Create'} deployment target`}
      id="create"
      onClose={onClose}
      width={1}
      zOffset={Z_INDEX_DIALOG}
    >
      {/* We reverse direction to ensure that inline links dont autofocus before other form elements */}
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden button to enable enter key submissions */}
        <button style={{ display: 'none' }} tabIndex={-1} type="submit" />

        {/* Form fields */}
        <Stack space={5}>
          {/* Title */}
          <FormFieldInputText
            disabled={formUpdating}
            description="Name displayed in this plugin (e.g. production, staging)"
            error={errors?.name}
            label="Name"
            name="name"
            ref={register}
          />

          <FormFieldInputText
            disabled={formUpdating}
            error={errors?.token}
            label="Vercel Account Token"
            name="token"
            ref={register}
          />

          <FormFieldInputText
            disabled={formUpdating}
            error={errors?.projectId}
            label="Vercel Project ID"
            name="projectId"
            ref={register}
          />

          <FormFieldInputText
            description="Required only if your project is owned by a team account"
            disabled={formUpdating}
            error={errors?.teamId}
            label="Vercel Team ID (optional)"
            name="teamId"
            ref={register}
          />

          <FormFieldInputText
            description="Enter a valid deploy hook URL to enable manual deploys"
            disabled={formUpdating}
            error={errors?.deployHook}
            label="Vercel Deploy Hook (optional)"
            name="deployHook"
            ref={register}
          />

          <FormFieldInputText
            disabled={formUpdating}
            error={errors?.deployLimit}
            label="Number of deploys to display"
            name="deployLimit"
            ref={register({ valueAsNumber: true })}
          />
        </Stack>
      </Box>
    </Dialog>
  )
}

export default DialogForm
