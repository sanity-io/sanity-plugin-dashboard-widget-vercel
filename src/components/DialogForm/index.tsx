import {yupResolver} from '@hookform/resolvers/yup'
import {Box, Button, Dialog, Flex, Stack, useToast} from '@sanity/ui'
import {useActor} from '@xstate/react'
import React, {FC, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'

import {Z_INDEX_DIALOG} from '../../constants'
import {formMachine} from '../../machines/form'
import sanitizeFormData from '../../utils/sanitizeFormData'
import FormFieldInputText from '../FormFieldInputText'
import {Sanity} from '../../types'
import {useSanityClient} from '../../client'
import {toPromise} from 'xstate'

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
  const {deploymentTarget, onClose, onCreate, onDelete, onUpdate} = props
  const client = useSanityClient()
  const toast = useToast()

  const [formState, formStateTransition, formStateActorRef] = useActor(formMachine, {
    input: {client},
  })

  const formUpdating = formState.hasTag('busy')

  // react-hook-form v7
  const {
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
  } = useForm<FormData>({
    // @ts-expect-error - fix typings later
    defaultValues: {
      deployHook: deploymentTarget?.deployHook || '',
      deployLimit: deploymentTarget?.deployLimit || 5,
      name: deploymentTarget?.name || '',
      projectId: deploymentTarget?.projectId || '',
      teamId: deploymentTarget?.teamId || '',
      token: deploymentTarget?.token || '',
    },
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  })

  /**
   * Handle errors and reaching the done state
   */
  useEffect(() => {
    if (formState.matches('error')) {
      toast.push({
        status: 'error',
        title: formState.context.message || 'An error occurred',
      })
    }
    /**
     * If the machine is done it means it reached updated, created, deleted or error state.
     * We don't care which one, we just want to close the dialog
     */
    if (formState.status === 'done') {
      onClose()
    }
  }, [formState, onClose, toast])

  // Callbacks
  // - submit react-hook-form
  const onSubmit = async (formData: FormData) => {
    const sanitizedFormData = sanitizeFormData(formData)
    if (deploymentTarget) {
      formStateTransition({type: 'UPDATE', id: deploymentTarget._id, formData: sanitizedFormData})
    } else {
      formStateTransition({type: 'CREATE', formData: sanitizedFormData})
    }
    await toPromise(formStateActorRef)
    const snapshot = formStateActorRef.getSnapshot()
    const {document} = snapshot.context
    if (!document) return
    if (snapshot.matches('created')) {
      onCreate?.(document)
    } else if (snapshot.matches('updated')) {
      onUpdate?.(document)
    }
  }

  const handleDelete = async () => {
    const id = deploymentTarget!._id
    formStateTransition({type: 'DELETE', id})
    await toPromise(formStateActorRef)
    if (formStateActorRef.getSnapshot().matches('deleted')) {
      onDelete?.(id)
    }
  }

  return (
    <Dialog
      footer={
        <Box padding={3}>
          <Flex justify={deploymentTarget ? 'space-between' : 'flex-end'}>
            {/* Delete button */}
            {deploymentTarget && (
              <Button
                loading={formState.matches('deleting')}
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
              loading={formState.matches('creating') || formState.matches('updating')}
              disabled={!isDirty || !isValid}
              fontSize={1}
              onClick={handleSubmit(onSubmit)}
              text={deploymentTarget ? 'Update and close' : 'Create'}
              tone="primary"
            />
          </Flex>
        </Box>
      }
      header={`${deploymentTarget ? 'Edit' : 'Create'} deployment target`}
      id="create"
      onClose={onClose}
      width={1}
      zOffset={Z_INDEX_DIALOG}
    >
      {/* We reverse direction to ensure that inline links dont autofocus before other form elements */}
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden button to enable enter key submissions */}
        <button style={{display: 'none'}} tabIndex={-1} type="submit" />

        {/* Form fields */}
        <Stack space={5}>
          {/* Title */}
          <FormFieldInputText
            disabled={formUpdating}
            description="Name displayed in this plugin (e.g. production, staging)"
            error={errors?.name}
            label="Name"
            // @ts-expect-error - fix typings later
            {...register('name')}
          />

          <FormFieldInputText
            disabled={formUpdating}
            error={errors?.token}
            label="Vercel Account Token"
            // @ts-expect-error - fix typings later
            {...register('token')}
          />

          <FormFieldInputText
            disabled={formUpdating}
            error={errors?.projectId}
            label="Vercel Project ID"
            // @ts-expect-error - fix typings later
            {...register('projectId')}
          />

          <FormFieldInputText
            description="Required only if your project is owned by a team account"
            disabled={formUpdating}
            error={errors?.teamId}
            label="Vercel Team ID (optional)"
            // @ts-expect-error - fix typings later
            {...register('teamId')}
          />

          <FormFieldInputText
            description="Enter a valid deploy hook URL to enable manual deploys"
            disabled={formUpdating}
            error={errors?.deployHook}
            label="Vercel Deploy Hook (optional)"
            // @ts-expect-error - fix typings later
            {...register('deployHook')}
          />

          <FormFieldInputText
            disabled={formUpdating}
            error={errors?.deployLimit}
            label="Number of deploys to display"
            // @ts-expect-error - fix typings later
            {...register('deployLimit', {valueAsNumber: true})}
          />
        </Stack>
      </Box>
    </Dialog>
  )
}

export default DialogForm
