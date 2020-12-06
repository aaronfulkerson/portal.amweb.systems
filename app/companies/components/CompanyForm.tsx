import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { InputGroupAdapter } from '@components/FormAdapters'

import { Company } from '@prisma/client'
import { CreateCompanyType, UpdateCompanyType } from '../validations'

interface ICompanyForm {
  company?: Company
  onSubmit: (values: any) => Promise<void>
  validate: (values: any) => any
}

export const CompanyForm: FunctionComponent<ICompanyForm> = ({ company, onSubmit, validate }) => {
  const mode = company ? 'Update' : 'Create'
  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY} id="company-form">
        {company && <Field component={() => <></>} initialValue={company?.id} name="id" />}
        <Field
          component={InputGroupAdapter}
          disabled={submitting}
          initialValue={company?.name}
          large
          name="name"
          placeholder="Company Name"
        />
        {!company && (
          <Field
            component={InputGroupAdapter}
            disabled={submitting}
            large
            name="userName"
            placeholder="Owner Name"
          />
        )}
        <Field
          component={InputGroupAdapter}
          disabled={submitting}
          initialValue={company?.email}
          large
          name="email"
          placeholder="Email"
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={pristine || submitting}
            intent="primary"
            large
            text={`${mode} Company`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return company ? (
    <Form<UpdateCompanyType> onSubmit={onSubmit} render={render} validate={validate} />
  ) : (
    <Form<CreateCompanyType> onSubmit={onSubmit} render={render} validate={validate} />
  )
}
