import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { FeatureForm } from './FeatureForm'

import { Feature } from '@prisma/client'
import { UpdateFeature } from '../../validations'
import updateFeature from '../../mutations/updateFeature'
import getFeatures from 'app/projects/queries/getFeatures'

interface IUpdateFeatureForm {
  close: () => void
  feature: Feature
}

export const UpdateFeatureForm: FunctionComponent<IUpdateFeatureForm> = ({ close, feature }) => {
  const [updateFeatureMutation] = useMutation(updateFeature)

  return (
    <FeatureForm
      feature={feature}
      onSubmit={async (values) => {
        try {
          await updateFeatureMutation(values)
          await invalidateQuery(getFeatures)
          close()
          AppToaster?.show({ intent: 'success', message: 'Updated feature.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          UpdateFeature.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
