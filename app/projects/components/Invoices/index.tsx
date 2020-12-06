import { ChangeEvent, FunctionComponent, useState } from 'react'
import { invalidateQuery, useQuery, useSession } from 'blitz'
import { Button, ButtonGroup, Dialog, NonIdealState, Switch } from '@blueprintjs/core'

import { Invoice } from './Invoice'
import { CreateInvoiceForm } from './CreateInvoiceForm'

import { ProjectWithCompany } from '../../types'
import getInvoices from 'app/projects/queries/getInvoices'
import getNotifications from 'app/queries/getNotifications'

const ITEMS_PER_PAGE = 5

export const Invoices: FunctionComponent<{ project?: ProjectWithCompany }> = ({ project }) => {
  const { roles } = useSession()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<number>(0)
  const [paid, setPaid] = useState(false)
  const [{ hasMore, invoices }] = useQuery(
    getInvoices,
    { projectId: project?.id!, paid, skip: ITEMS_PER_PAGE * page, take: ITEMS_PER_PAGE },
    { enabled: project, onSuccess: () => invalidateQuery(getNotifications) }
  )

  const previousPage = () => setPage(page - 1)
  const nextPage = () => setPage(page + 1)

  return (
    <>
      <div className="project-tab-controls">
        <ButtonGroup className="pagination">
          <Button disabled={page <= 0} onClick={previousPage} icon="arrow-left" />
          <Button disabled={!hasMore} onClick={nextPage} icon="arrow-right" />
        </ButtonGroup>
        {roles.includes('ADMIN') && (
          <Button disabled={paid} icon="plus" onClick={() => setOpen(true)} text="Create Invoice" />
        )}
        <Switch
          checked={paid}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPaid(e.target.checked)}
          label="Show paid invoices"
        />
      </div>

      <Dialog
        icon="plus"
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`Create Invoice: ${project?.repo}`}
      >
        <CreateInvoiceForm close={() => setOpen(false)} projectId={project?.id!} />
      </Dialog>

      {!!invoices.length ? (
        invoices.map((invoice, i) => <Invoice invoice={invoice} key={i} />)
      ) : (
        <NonIdealState icon="warning-sign" title={`No ${paid ? 'paid ' : ''}invoices yet`} />
      )}
    </>
  )
}
