import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { ProjectForm } from './ProjectForm'
import { AppToaster } from '@components/Toaster'

import { ProjectWithCompany } from '../types'
import { UpdateProject } from '../validations'
import updateProject from '../mutations/updateProject'
import getProjects from '../queries/getProjects'

interface IUpdateProjectForm {
  close: () => void
  project?: ProjectWithCompany
}

export const UpdateProjectForm: FunctionComponent<IUpdateProjectForm> = ({ close, project }) => {
  const [updateProjectMutation] = useMutation(updateProject)

  return (
    <ProjectForm
      onSubmit={async (values) => {
        try {
          await updateProjectMutation(values)
          await invalidateQuery(getProjects)
          close()
          AppToaster?.show({ intent: 'success', message: 'Updated project.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      project={project}
      validate={(values) => {
        try {
          UpdateProject.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
