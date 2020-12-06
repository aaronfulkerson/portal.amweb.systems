import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { FeatureDetailForm } from './FeatureDetailForm'

import { FeatureDetail } from '@prisma/client'
import { UpdateFeatureDetail } from '../../validations'
import updateFeatureDetail from '../../mutations/updateFeatureDetail'
import getFeatures from 'app/projects/queries/getFeatures'

interface IUpdateFeatureDetailForm {
  close: () => void
  featureDetail: FeatureDetail & { projectId: number }
}

export const UpdateFeatureDetailForm: FunctionComponent<IUpdateFeatureDetailForm> = ({
  close,
  featureDetail,
}) => {
  const [updateFeatureDetailMutation] = useMutation(updateFeatureDetail)

  return (
    <FeatureDetailForm
      featureDetail={featureDetail}
      onSubmit={async (values) => {
        try {
          await updateFeatureDetailMutation(values)
          await invalidateQuery(getFeatures)
          close()
          AppToaster?.show({ intent: 'success', message: 'Updated feature detail.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          UpdateFeatureDetail.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
