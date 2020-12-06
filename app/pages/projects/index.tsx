import { useState } from 'react'
import { usePaginatedQuery, useSession } from 'blitz'
import { Button, ButtonGroup, Dialog } from '@blueprintjs/core'

import { Layout } from 'app/layouts/Layout'
import { CreateProjectForm } from 'app/projects/components/CreateProjectForm'
import { PageToolbar } from '@components/PageToolbar'
import { CompanySelect } from 'app/companies/components/CompanySelect'
import { ProjectsTable } from 'app/projects/components/ProjectsTable'

import { AmwebPage } from 'types'
import { Company } from '@prisma/client'
import getProjects from 'app/projects/queries/getProjects'

const ITEMS_PER_PAGE = 20

const Projects: AmwebPage = () => {
  const { roles } = useSession()
  const [company, setCompany] = useState<Company | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<number>(0)

  const [{ hasMore, projects }] = usePaginatedQuery(getProjects, {
    companyId: company?.id,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const previousPage = () => setPage(page - 1)
  const nextPage = () => setPage(page + 1)

  return (
    <div className="amweb-page">
      <PageToolbar>
        <ButtonGroup className="pagination">
          <Button disabled={page <= 0} onClick={previousPage} icon="arrow-left" />
          <Button disabled={!hasMore} onClick={nextPage} icon="arrow-right" />
        </ButtonGroup>
        {roles.includes('ADMIN') && (
          <>
            <CompanySelect onSelect={setCompany} value={company} />
            <Button
              disabled={!company?.id}
              icon="plus"
              onClick={() => setOpen(true)}
              text="New Project"
            />
          </>
        )}
      </PageToolbar>

      <Dialog
        icon="user"
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`${company?.name} - New Project`}
      >
        <CreateProjectForm close={() => setOpen(false)} companyId={company?.id} />
      </Dialog>

      <ProjectsTable projects={projects} />
    </div>
  )
}

Projects.getLayout = (page) => <Layout title="Projects">{page}</Layout>

Projects.allowed = ['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT']

export default Projects
