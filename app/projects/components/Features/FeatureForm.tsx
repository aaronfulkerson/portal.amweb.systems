import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { InputGroupAdapter, TextAreaAdapter } from '@components/FormAdapters'

import { Feature } from '@prisma/client'

interface IFeatureForm {
  projectId?: number
  onSubmit: (values: any) => Promise<void>
  feature?: Feature
  validate: (values: any) => any
}

export const FeatureForm: FunctionComponent<IFeatureForm> = ({
  projectId,
  onSubmit,
  feature,
  validate,
}) => {
  const mode = feature ? 'Update' : 'Create'
  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        {projectId && <Field component={() => <></>} initialValue={projectId} name="projectId" />}
        {feature && (
          <>
            <Field component={() => <></>} initialValue={feature.id} name="id" />
            <Field component={() => <></>} initialValue={feature.projectId} name="projectId" />
          </>
        )}
        <Field
          component={InputGroupAdapter}
          disabled={submitting}
          initialValue={feature?.title}
          large
          name="title"
          placeholder="Title"
        />
        <Field
          component={TextAreaAdapter}
          disabled={submitting}
          fill
          initialValue={feature?.description}
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
            text={`${mode} Feature`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return <Form onSubmit={onSubmit} render={render} validate={validate} />
}
