import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { FeatureDetailForm } from './FeatureDetailForm'

import { CreateFeatureDetail, CreateFeatureDetailType } from '../../validations'
import createFeatureDetail from '../../mutations/createFeatureDetail'
import getFeatures from 'app/projects/queries/getFeatures'

interface ICreateFeatureDetailForm {
  close: () => void
  featureDetail: CreateFeatureDetailType
}

export const CreateFeatureDetailForm: FunctionComponent<ICreateFeatureDetailForm> = ({
  close,
  featureDetail,
}) => {
  const [createFeatureDetailMutation] = useMutation(createFeatureDetail)

  return (
    <FeatureDetailForm
      featureDetail={featureDetail}
      onSubmit={async (values) => {
        try {
          await createFeatureDetailMutation(values)
          await invalidateQuery(getFeatures)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created feature detail.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          CreateFeatureDetail.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
