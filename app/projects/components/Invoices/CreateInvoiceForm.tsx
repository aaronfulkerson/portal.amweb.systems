import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { InvoiceForm } from './InvoiceForm'

import { CreateInvoice } from '../../validations'
import createInvoice from 'app/projects/mutations/createInvoice'
import getInvoices from 'app/projects/queries/getInvoices'

interface ICreateInvoiceForm {
  close: () => void
  projectId: number
}

export const CreateInvoiceForm: FunctionComponent<ICreateInvoiceForm> = ({ close, projectId }) => {
  const [createInvoiceMutation] = useMutation(createInvoice)

  return (
    <InvoiceForm
      onSubmit={async (values) => {
        try {
          await createInvoiceMutation(values)
          await invalidateQuery(getInvoices)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created invoice.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      projectId={projectId}
      validate={(values) => {
        try {
          CreateInvoice.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
