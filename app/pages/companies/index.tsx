import { useState } from 'react'
import { usePaginatedQuery } from 'blitz'
import { Button, ButtonGroup, Dialog } from '@blueprintjs/core'
import { AmwebPage } from 'types'

import { Layout } from 'app/layouts/Layout'
import { PageToolbar } from '@components/PageToolbar'
import { CreateCompanyForm } from 'app/companies/components/CreateCompanyForm'
import { CompaniesTable } from 'app/companies/components/CompaniesTable'

import getCompanies from 'app/companies/queries/getCompanies'

const ITEMS_PER_PAGE = 20

const Companies: AmwebPage = () => {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<number>(0)

  const [{ companies, hasMore }] = usePaginatedQuery(getCompanies, {
    companyQuery: undefined,
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
        <Button icon="plus" onClick={() => setOpen(true)} text="New Company" />
      </PageToolbar>

      <Dialog icon="office" isOpen={open} onClose={() => setOpen(false)} title="New Company">
        <CreateCompanyForm close={() => setOpen(false)} />
      </Dialog>

      <CompaniesTable companies={companies} />
    </div>
  )
}

Companies.getLayout = (page) => <Layout title="Companies">{page}</Layout>

Companies.allowed = ['ADMIN']

export default Companies
