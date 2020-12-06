import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { UserForm } from './UserForm'
import { AppToaster } from '@components/Toaster'

import { UserWithCompany } from '../types'
import { UpdateUser } from '../validations'
import updateUser from '../mutations/updateUser'
import getUsers from '../queries/getUsers'

interface IUpdateUserForm {
  close: () => void
  user?: UserWithCompany
}

export const UpdateUserForm: FunctionComponent<IUpdateUserForm> = ({ close, user }) => {
  const [updateUserMutation] = useMutation(updateUser)

  return (
    <UserForm
      user={user}
      onSubmit={async (values) => {
        try {
          await updateUserMutation(values)
          await invalidateQuery(getUsers)
          close()
          AppToaster?.show({ intent: 'success', message: 'Updated user.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          UpdateUser.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
