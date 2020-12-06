import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { HTMLSelectAdapter, InputGroupAdapter } from '@components/FormAdapters'

import { User } from '@prisma/client'
import { CreateUserType, UpdateUserType } from '../validations'

interface IUserForm {
  companyId?: number
  onSubmit: (values: any) => Promise<void>
  user?: User
  validate: (values: any) => any
}

export const UserForm: FunctionComponent<IUserForm> = ({ companyId, onSubmit, user, validate }) => {
  const mode = user ? 'Update' : 'Create'
  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        {user && <Field component={() => <></>} initialValue={user?.id} name="id" />}
        {companyId && <Field component={() => <></>} initialValue={companyId} name="companyId" />}
        <Field
          component={InputGroupAdapter}
          disabled={submitting}
          initialValue={user?.name}
          large
          name="name"
          placeholder="Name"
        />
        <Field
          component={InputGroupAdapter}
          disabled={submitting}
          initialValue={user?.email}
          large
          name="email"
          placeholder="Email"
        />
        <Field
          component={HTMLSelectAdapter}
          defaultValue="BASIC_CLIENT"
          disabled={submitting}
          fill
          initialValue={user?.role}
          large
          name="role"
          options={['BASIC_CLIENT', 'PRIVILEGED_CLIENT']}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={pristine || submitting}
            intent="primary"
            large
            text={`${mode} User`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return user ? (
    <Form<UpdateUserType> onSubmit={onSubmit} render={render} validate={validate} />
  ) : (
    <Form<CreateUserType> onSubmit={onSubmit} render={render} validate={validate} />
  )
}
