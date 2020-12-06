import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { InputGroupAdapter, TextAreaAdapter } from '@components/FormAdapters'

import { Project } from '@prisma/client'

interface IProjectForm {
  companyId?: number
  onSubmit: (values: any) => Promise<void>
  project?: Project
  validate: (values: any) => any
}

export const ProjectForm: FunctionComponent<IProjectForm> = ({
  companyId,
  onSubmit,
  project,
  validate,
}) => {
  const mode = project ? 'Update' : 'Create'

  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        {companyId && <Field component={() => <></>} initialValue={companyId} name="companyId" />}
        {project && <Field component={() => <></>} initialValue={project?.id} name="id" />}
        <Field
          component={InputGroupAdapter}
          disabled={submitting}
          initialValue={project?.repo}
          large
          name="repo"
          placeholder="Repository Name"
        />
        <Field
          component={TextAreaAdapter}
          disabled={submitting}
          fill
          initialValue={project?.description}
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
            text={`${mode} Project`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return <Form onSubmit={onSubmit} render={render} validate={validate} />
}
