import { Dispatch, FunctionComponent } from 'react'
import { IOptionProps } from '@blueprintjs/core'

import { AppToaster } from '@components/Toaster'
import { PriceForm } from './PriceForm'

import { TInvoicePlaceholderAction } from './InvoicePlaceholder'
import { EditPrice } from '../../validations'
import { IPrice } from 'app/projects/types'

interface IEditPriceForm {
  close: () => void
  dispatch: Dispatch<TInvoicePlaceholderAction>
  options: IOptionProps[]
  price_data: IPrice
}

export const EditPriceForm: FunctionComponent<IEditPriceForm> = ({
  close,
  dispatch,
  options,
  price_data,
}) => {
  return (
    <PriceForm
      onSubmit={async ({ product, recurring, unit_amount }) => {
        try {
          const name = options.find(({ value }) => value === product)?.label!
          dispatch({
            type: 'EDIT_PRICE',
            price_data: {
              ...(recurring && { recurring: { interval: 'month', interval_count: 1 } }),
              product: { id: product, name },
              unit_amount: unit_amount * 100,
            },
          })
          close()
          AppToaster?.show({ intent: 'success', message: 'Edited price.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      options={options}
      price_data={price_data}
      validate={(values) => {
        try {
          EditPrice.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
