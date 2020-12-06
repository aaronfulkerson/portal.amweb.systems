import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { FeatureForm } from './FeatureForm'

import { CreateFeature } from '../../validations'
import createFeature from '../../mutations/createFeature'
import getFeatures from 'app/projects/queries/getFeatures'

interface ICreateFeatureForm {
  close: () => void
  projectId?: number
}

export const CreateFeatureForm: FunctionComponent<ICreateFeatureForm> = ({ close, projectId }) => {
  const [createFeatureMutation] = useMutation(createFeature)

  return (
    <FeatureForm
      onSubmit={async (values) => {
        try {
          await createFeatureMutation(values)
          await invalidateQuery(getFeatures)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created feature.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      projectId={projectId}
      validate={(values) => {
        try {
          CreateFeature.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
