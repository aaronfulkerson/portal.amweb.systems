import { Dispatch, FunctionComponent } from 'react'

import { AppToaster } from '@components/Toaster'
import { PriceForm } from './PriceForm'

import { TInvoicePlaceholderAction } from './InvoicePlaceholder'
import { AddPrice } from '../../validations'
import { IOptionProps } from '@blueprintjs/core'

interface IAddPriceForm {
  close: () => void
  dispatch: Dispatch<TInvoicePlaceholderAction>
  options: IOptionProps[]
}

export const AddPriceForm: FunctionComponent<IAddPriceForm> = ({ close, dispatch, options }) => {
  return (
    <PriceForm
      onSubmit={async ({ product, recurring, unit_amount }) => {
        try {
          const name = options.find(({ value }) => value === product)?.label!
          dispatch({
            type: 'ADD_PRICE',
            price_data: {
              ...(recurring && { recurring: { interval: 'month', interval_count: 1 } }),
              product: { id: product, name },
              unit_amount: unit_amount * 100,
            },
          })
          close()
          AppToaster?.show({ intent: 'success', message: 'Added price.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      options={options}
      validate={(values) => {
        try {
          AddPrice.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
