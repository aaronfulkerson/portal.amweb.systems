import { FunctionComponent } from 'react'
import { Button, Classes } from '@blueprintjs/core'
import Stripe from 'stripe'
import { Field, Form } from 'react-final-form'

import { HTMLSelectAdapter, InputGroupAdapter } from '@components/FormAdapters'

interface IProductForm {
  onSubmit: (values: any) => Promise<void>
  product?: Stripe.Product
  validate: (values: any) => any
}

export const ProductForm: FunctionComponent<IProductForm> = ({ onSubmit, product, validate }) => {
  const mode = product ? 'Update' : 'Create'
  const types = ['monthly', 'service']

  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        {product && <Field component={() => <></>} initialValue={product?.id} name="id" />}
        <Field
          component={InputGroupAdapter}
          disabled={submitting}
          initialValue={product?.name}
          large
          name="name"
          placeholder="Product Name"
        />
        <Field
          component={InputGroupAdapter}
          disabled={submitting || product?.id}
          initialValue={product?.id}
          large
          name="id"
          placeholder="Product ID"
        />
        <Field
          component={HTMLSelectAdapter}
          defaultValue={'service'}
          disabled={submitting}
          fill
          initialValue={product?.metadata.type}
          large
          name="type"
          options={types}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={pristine || submitting}
            intent="primary"
            large
            text={`${mode} Product`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return <Form onSubmit={onSubmit} render={render} validate={validate} />
}
