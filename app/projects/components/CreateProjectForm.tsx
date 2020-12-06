import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { ProjectForm } from './ProjectForm'
import { AppToaster } from '@components/Toaster'

import { CreateProject } from '../validations'
import createProject from '../mutations/createProject'
import getProjects from '../queries/getProjects'

interface ICreateProjectForm {
  companyId?: number
  close: () => void
}

export const CreateProjectForm: FunctionComponent<ICreateProjectForm> = ({ close, companyId }) => {
  const [createProjectMutation] = useMutation(createProject)

  return (
    <ProjectForm
      companyId={companyId}
      onSubmit={async (values) => {
        try {
          await createProjectMutation(values)
          await invalidateQuery(getProjects)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created project.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          CreateProject.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
