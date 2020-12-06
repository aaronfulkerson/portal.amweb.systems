import { Dispatch, FunctionComponent, Reducer, useReducer } from 'react'
import { Button, Dialog, IconName, IOptionProps } from '@blueprintjs/core'

import { EditPriceForm } from './EditPriceForm'

import { IPrice } from 'app/projects/types'
import { TInvoicePlaceholderAction } from './InvoicePlaceholder'

interface IPriceRow {
  options?: IOptionProps[]
  price_data: IPrice
  priceDispatch?: Dispatch<TInvoicePlaceholderAction>
}

type IFormActionType = 'ADD_PRICE' | 'EDIT_PRICE' | 'CLOSE'

interface IFormState {
  action?: IFormActionType
  icon?: IconName
  open: boolean
  title?: string
}

interface IFormAction {
  type: IFormActionType
}

const initialState: IFormState = {
  action: undefined,
  icon: undefined,
  open: false,
  title: undefined,
}

const reducer: Reducer<IFormState, IFormAction> = (state, action) => {
  switch (action.type) {
    case 'ADD_PRICE':
      return { action: action.type, icon: 'plus', open: true, title: 'Add Price' }
    case 'EDIT_PRICE':
      return { action: action.type, icon: 'edit', open: true, title: 'Edit Price' }
    case 'CLOSE':
      return initialState
  }
}

export const PriceRow: FunctionComponent<IPriceRow> = ({ options, price_data, priceDispatch }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      {options && priceDispatch && (
        <Dialog
          icon={state.icon}
          isOpen={state.open}
          onClose={() => dispatch({ type: 'CLOSE' })}
          title={state.title}
        >
          {state.action === 'EDIT_PRICE' && (
            <EditPriceForm
              close={() => dispatch({ type: 'CLOSE' })}
              price_data={price_data}
              dispatch={priceDispatch}
              options={options}
            />
          )}
        </Dialog>
      )}

      {options && priceDispatch && (
        <div className="left-border actions">
          <Button icon="edit" onClick={() => dispatch({ type: 'EDIT_PRICE' })} small />
          <Button
            icon="trash"
            onClick={() => priceDispatch({ type: 'REMOVE_PRICE', product: price_data.product.id })}
            small
          />
        </div>
      )}

      <div className={!(options && priceDispatch) ? 'left-border' : ''}>
        {price_data.product.name}&nbsp;
        {price_data.recurring &&
          `(every ${price_data.recurring.interval_count} ${price_data.recurring.interval})`}
      </div>

      <div className="right-border">{(price_data.unit_amount / 100.0).toFixed(2)}</div>
    </>
  )
}
