import { FunctionComponent, useState } from 'react'
import { useRouter } from 'blitz'
import { Button, Dialog, H6 } from '@blueprintjs/core'

import { UpdateProjectForm } from './UpdateProjectForm'

import { ProjectWithCompany } from '../types'

const ProjectRow: FunctionComponent<{ project: ProjectWithCompany }> = ({ project }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Dialog
        icon="user"
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`${project?.company?.name} - Update Project`}
      >
        <UpdateProjectForm close={() => setOpen(false)} project={project} />
      </Dialog>

      <div className="left-border actions">
        <Button icon="edit" onClick={() => setOpen(true)} small />
        <Button
          icon="document-open"
          onClick={async () => await router.push(`/projects/${project.id}`)}
          small
        />
      </div>
      <div>{project.repo}</div>
      <div>{project.description}</div>
      <div className="right-border">{project.company.name}</div>
    </>
  )
}

export const ProjectsTable: FunctionComponent<{ projects: ProjectWithCompany[] }> = ({
  projects,
}) => {
  return (
    <>
      {!!projects.length && (
        <div className="data-grid projects-grid">
          <H6>Actions</H6>
          <H6>Repository</H6>
          <H6>Description</H6>
          <H6>Company</H6>
          {projects.map((project, i) => (
            <ProjectRow key={i} project={project} />
          ))}
        </div>
      )}
    </>
  )
}
