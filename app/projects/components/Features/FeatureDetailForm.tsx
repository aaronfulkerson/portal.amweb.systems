import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { TextAreaAdapter } from '@components/FormAdapters'

import { FeatureDetail } from '@prisma/client'
import { CreateFeatureDetailType } from 'app/projects/validations'

interface IFeatureDetailForm {
  featureDetail: FeatureDetail | CreateFeatureDetailType
  onSubmit: (values: any) => Promise<void>
  validate: (values: any) => any
}

export const FeatureDetailForm: FunctionComponent<IFeatureDetailForm> = ({
  featureDetail,
  onSubmit,
  validate,
}) => {
  const mode = 'id' in featureDetail ? 'Update' : 'Create'
  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        {'id' in featureDetail && (
          <Field component={() => <></>} initialValue={featureDetail.id} name="id" />
        )}
        <Field component={() => <></>} initialValue={featureDetail.featureId} name="featureId" />
        <Field
          component={TextAreaAdapter}
          disabled={submitting}
          fill
          initialValue={featureDetail.description}
          large
          name="description"
          placeholder="Description"
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={pristine || submitting}
            intent="primary"
            large
            text={`${mode} Feature Detail`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return <Form onSubmit={onSubmit} render={render} validate={validate} />
}
