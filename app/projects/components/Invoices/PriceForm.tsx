import { FunctionComponent } from 'react'
import { Button, Classes, IOptionProps } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { CheckboxAdapter, HTMLSelectAdapter, NumericInputAdapter } from '@components/FormAdapters'

import { IPrice } from 'app/projects/types'

interface IPriceForm {
  price_data?: IPrice
  onSubmit: (values: any) => Promise<void>
  options: IOptionProps[]
  validate: (values: any) => any
}

export const PriceForm: FunctionComponent<IPriceForm> = ({
  onSubmit,
  options,
  price_data,
  validate,
}) => {
  const mode = price_data ? 'Edit' : 'Add'
  const initialAmount = price_data?.unit_amount ? (price_data.unit_amount / 100).toString() : '1.00'

  const render = ({ handleSubmit, pristine, submitting }) => (
    <form onSubmit={handleSubmit}>
      <div className={Classes.DIALOG_BODY}>
        <Field
          component={NumericInputAdapter}
          disabled={submitting}
          fill
          initialValue={initialAmount}
          large
          min={1.0}
          minorStepSize={0.01}
          name="unit_amount"
          placeholder="Amount"
          stepSize={1.0}
        />
        <Field
          component={HTMLSelectAdapter}
          defaultValue={options[0].value}
          disabled={submitting}
          fill
          initialValue={price_data?.product.id}
          large
          name="product"
          options={options}
        />
        <Field
          component={CheckboxAdapter}
          disabled={submitting}
          initialValue={!!price_data?.recurring}
          label="Recurring"
          name="recurring"
          type="checkbox"
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            disabled={pristine || submitting}
            intent="primary"
            large
            text={`${mode} Price`}
            type="submit"
          />
        </div>
      </div>
    </form>
  )

  return <Form onSubmit={onSubmit} render={render} validate={validate} />
}
