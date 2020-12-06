import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { IssueForm } from './IssueForm'

import { Issue } from '@prisma/client'
import { UpdateIssue } from '../../validations'
import updateIssue from 'app/projects/mutations/updateIssue'
import getIssues from 'app/projects/queries/getIssues'

interface IUpdateIssueForm {
  close: () => void
  issue: Issue
}

export const UpdateIssueForm: FunctionComponent<IUpdateIssueForm> = ({ close, issue }) => {
  const [updateIssueMutation] = useMutation(updateIssue)

  return (
    <IssueForm
      issue={issue}
      onSubmit={async (values) => {
        try {
          await updateIssueMutation(values)
          await invalidateQuery(getIssues)
          close()
          AppToaster?.show({ intent: 'success', message: 'Updated issue.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          UpdateIssue.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
