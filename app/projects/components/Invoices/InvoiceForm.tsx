import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

interface IInvoiceForm {
  projectId?: number
  onSubmit: (values: any) => Promise<void>
  validate: (values: any) => any
}

export const InvoiceForm: FunctionComponent<IInvoiceForm> = ({ projectId, onSubmit, validate }) => {
  const render = ({ handleSubmit, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        Create a new invoice?
        <Field component={() => <></>} initialValue={projectId} name="projectId" />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={submitting}
            intent="primary"
            large
            text={`Create Invoice`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return <Form onSubmit={onSubmit} render={render} validate={validate} />
}
