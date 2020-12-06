import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { UserForm } from './UserForm'
import { AppToaster } from '@components/Toaster'

import { CreateUser } from '../validations'
import createUser from '../mutations/createUser'
import getUsers from '../queries/getUsers'

interface ICreateUserForm {
  close: () => void
  companyId?: number
}

export const CreateUserForm: FunctionComponent<ICreateUserForm> = ({ close, companyId }) => {
  const [createUserMutation] = useMutation(createUser)

  return (
    <UserForm
      companyId={companyId}
      onSubmit={async (values) => {
        try {
          await createUserMutation(values)
          await invalidateQuery(getUsers)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created user.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          CreateUser.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
