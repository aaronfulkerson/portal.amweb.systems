import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { CompanyForm } from './CompanyForm'
import { AppToaster } from '@components/Toaster'

import { CreateCompany } from '../validations'
import createCompany from '../mutations/createCompany'
import getCompanies from '../queries/getCompanies'

export const CreateCompanyForm: FunctionComponent<{ close: () => void }> = ({ close }) => {
  const [createCompanyMutation] = useMutation(createCompany)

  return (
    <CompanyForm
      onSubmit={async (values) => {
        try {
          await createCompanyMutation(values)
          await invalidateQuery(getCompanies)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created company.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          CreateCompany.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
