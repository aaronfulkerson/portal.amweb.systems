import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { CompanyForm } from './CompanyForm'
import { AppToaster } from '@components/Toaster'

import { Company } from '@prisma/client'
import { UpdateCompany } from '../validations'
import updateCompany from '../mutations/updateCompany'
import getCompanies from '../queries/getCompanies'

interface IUpdateCompanyForm {
  close: () => void
  company?: Company
}

export const UpdateCompanyForm: FunctionComponent<IUpdateCompanyForm> = ({ close, company }) => {
  const [updateCompanyMutation] = useMutation(updateCompany)

  return (
    <CompanyForm
      company={company}
      onSubmit={async (values) => {
        try {
          await updateCompanyMutation(values)
          await invalidateQuery(getCompanies)
          close()
          AppToaster?.show({ intent: 'success', message: 'Updated company.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          UpdateCompany.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
