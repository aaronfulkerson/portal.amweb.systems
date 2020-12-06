import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { InputGroupAdapter, TextAreaAdapter } from '@components/FormAdapters'

import { Issue } from '@prisma/client'

interface IIssueForm {
  projectId?: number
  onSubmit: (values: any) => Promise<void>
  issue?: Issue
  validate: (values: any) => any
}

export const IssueForm: FunctionComponent<IIssueForm> = ({
  projectId,
  onSubmit,
  issue,
  validate,
}) => {
  const mode = issue ? 'Update' : 'Create'
  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        {projectId && <Field component={() => <></>} initialValue={projectId} name="projectId" />}
        {issue && (
          <>
            <Field component={() => <></>} initialValue={issue.id} name="id" />
            <Field component={() => <></>} initialValue={issue.projectId} name="projectId" />
          </>
        )}
        {!issue && (
          <Field
            component={InputGroupAdapter}
            disabled={submitting}
            large
            name="title"
            placeholder="Title"
          />
        )}
        <Field
          component={TextAreaAdapter}
          disabled={submitting}
          fill
          initialValue={issue?.description}
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
            text={`${mode} Issue`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return <Form onSubmit={onSubmit} render={render} validate={validate} />
}
