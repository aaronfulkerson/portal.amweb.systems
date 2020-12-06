import { ChangeEvent, useState } from 'react'
import { useQuery, useSession } from 'blitz'
import { Button, ButtonGroup, Switch } from '@blueprintjs/core'

import { Layout } from 'app/layouts/Layout'
import { CompanySelect } from 'app/companies/components/CompanySelect'
import { PageToolbar } from '@components/PageToolbar'
import { Invoice } from 'app/projects/components/Invoices/Invoice'

import { AmwebPage } from 'types'
import { Company } from '@prisma/client'
import getInvoices from 'app/projects/queries/getInvoices'

const ITEMS_PER_PAGE = 5

const Invoices: AmwebPage = () => {
  const { roles } = useSession()
  const [company, setCompany] = useState<Company | undefined>(undefined)
  const [page, setPage] = useState<number>(0)
  const [paid, setPaid] = useState(false)

  const [{ hasMore, invoices }] = useQuery(getInvoices, {
    companyId: company?.id,
    hasStripeId: true,
    paid,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const previousPage = () => setPage(page - 1)
  const nextPage = () => setPage(page + 1)

  return (
    <div className="amweb-page invoices">
      <PageToolbar>
        <ButtonGroup className="pagination">
          <Button disabled={page <= 0} onClick={previousPage} icon="arrow-left" />
          <Button disabled={!hasMore} onClick={nextPage} icon="arrow-right" />
        </ButtonGroup>
        {roles.includes('ADMIN') && <CompanySelect onSelect={setCompany} value={company} />}
        <Switch
          checked={paid}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPaid(e.target.checked)}
          label="Show paid invoices"
        />
      </PageToolbar>

      {invoices.map((invoice, i) => (
        <Invoice invoice={invoice} key={i} />
      ))}
    </div>
  )
}

Invoices.getLayout = (page) => <Layout title="Invoices">{page}</Layout>

Invoices.allowed = ['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT']

export default Invoices
