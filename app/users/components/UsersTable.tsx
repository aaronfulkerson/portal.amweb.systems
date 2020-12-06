import { FunctionComponent, useState } from 'react'
import { Button, Dialog, H6 } from '@blueprintjs/core'

import { UpdateUserForm } from './UpdateUserForm'

import { UserWithCompany } from '../types'

const UserRow: FunctionComponent<{ user: UserWithCompany }> = ({ user }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Dialog icon="user" isOpen={open} onClose={() => setOpen(false)} title="Update User">
        <UpdateUserForm close={() => setOpen(false)} user={user} />
      </Dialog>

      <div className="actions">
        <Button icon="edit" onClick={() => setOpen(true)} small />
      </div>
      <div className="name">{user.name}</div>
      <div className="email">{user.email}</div>
      <div className="role">{user.role}</div>
      <div className="company">{user.company?.name}</div>
    </>
  )
}

export const UsersTable: FunctionComponent<{ users: UserWithCompany[] }> = ({ users }) => {
  return (
    <>
      {!!users.length && (
        <div className="users-grid">
          <H6>Actions</H6>
          <H6>Name</H6>
          <H6>Email</H6>
          <H6>Role</H6>
          <H6>Company</H6>
          {users.map((user, i) => (
            <UserRow key={i} user={user} />
          ))}
        </div>
      )}
    </>
  )
}
