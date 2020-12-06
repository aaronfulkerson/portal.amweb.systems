import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { IssueForm } from './IssueForm'

import { CreateIssue } from '../../validations'
import createIssue from 'app/projects/mutations/createIssue'
import getIssues from 'app/projects/queries/getIssues'

interface ICreateIssueForm {
  close: () => void
  projectId?: number
}

export const CreateIssueForm: FunctionComponent<ICreateIssueForm> = ({ close, projectId }) => {
  const [createIssueMutation] = useMutation(createIssue)

  return (
    <IssueForm
      onSubmit={async (values) => {
        try {
          await createIssueMutation(values)
          await invalidateQuery(getIssues)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created issue.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      projectId={projectId}
      validate={(values) => {
        try {
          CreateIssue.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
