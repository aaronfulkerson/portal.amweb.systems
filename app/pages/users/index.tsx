import { useState } from 'react'
import { useQuery } from 'blitz'
import { Button, ButtonGroup, Dialog } from '@blueprintjs/core'
import { Layout } from 'app/layouts/Layout'

import { CompanySelect } from '../../companies/components/CompanySelect'
import { UsersTable } from '../../users/components/UsersTable'
import { CreateUserForm } from '../../users/components/CreateUserForm'
import { PageToolbar } from '@components/PageToolbar'

import { Company } from '@prisma/client'
import { AmwebPage } from 'types'
import getUsers from '../../users/queries/getUsers'

const ITEMS_PER_PAGE = 20

const Users: AmwebPage = () => {
  const [company, setCompany] = useState<Company | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<number>(0)

  const [{ hasMore, users }] = useQuery(getUsers, {
    companyId: company?.id,
    userQuery: undefined,
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
        <CompanySelect onSelect={setCompany} value={company} />
        <Button disabled={!company?.id} icon="plus" onClick={() => setOpen(true)} text="New User" />
      </PageToolbar>

      <Dialog
        icon="user"
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`${company?.name} - New User`}
      >
        <CreateUserForm close={() => setOpen(false)} companyId={company?.id} />
      </Dialog>

      <UsersTable users={users} />
    </div>
  )
}

Users.getLayout = (page) => <Layout title="Users">{page}</Layout>

Users.allowed = ['ADMIN']

export default Users
