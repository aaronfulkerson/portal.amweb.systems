import { FunctionComponent, Reducer, useReducer, useState } from 'react'
import { invalidateQuery, useMutation, useQuery } from 'blitz'
import { Button, Card, Dialog, H5, H6, Tag } from '@blueprintjs/core'

import { AppToaster } from '@components/Toaster'
import { PriceRow } from './PriceRow'
import { AddPriceForm } from './AddPriceForm'

import { IPrice, InvoiceWithCompany } from 'app/projects/types'
import deleteInvoice from 'app/projects/mutations/deleteInvoice'
import prepareInvoice from 'app/projects/mutations/prepareInvoice'
import getProducts from 'app/products/queries/getProducts'
import getInvoices from 'app/projects/queries/getInvoices'

interface IInvoicePlaceholderState {
  items: IPrice[]
}

export type TInvoicePlaceholderAction =
  | { type: 'ADD_PRICE'; price_data: IPrice }
  | { type: 'EDIT_PRICE'; price_data: IPrice }
  | { type: 'REMOVE_PRICE'; product: string }

const initialState: IInvoicePlaceholderState = { items: [] }

const reducer: Reducer<IInvoicePlaceholderState, TInvoicePlaceholderAction> = (state, action) => {
  switch (action.type) {
    case 'ADD_PRICE':
      return {
        ...state,
        items: [...state.items, action.price_data],
      }
    case 'EDIT_PRICE':
      state.items.splice(
        state.items.findIndex((item) => item.product.id === action.price_data.product.id),
        1,
        action.price_data
      )
      return { ...state }
    case 'REMOVE_PRICE':
      return {
        ...state,
        items: state.items.filter(({ product }) => product.id !== action.product),
      }
  }
}

export const InvoicePlaceholder: FunctionComponent<{ invoice: InvoiceWithCompany }> = ({
  invoice,
}) => {
  const [{ data }] = useQuery(getProducts, undefined)
  const products = data.map(({ id, name }) => ({
    label: name,
    value: id,
  }))

  const [deleteInvoiceMutation] = useMutation(deleteInvoice)
  const [prepareInvoiceMutation, { isLoading }] = useMutation(prepareInvoice)

  const [open, setOpen] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)

  const total = state.items.reduce((sum, { unit_amount }) => sum + unit_amount!, 0)

  return (
    <>
      <Dialog icon="plus" isOpen={open} onClose={() => setOpen(false)} title="Add Price">
        <AddPriceForm close={() => setOpen(false)} dispatch={dispatch} options={products} />
      </Dialog>

      <Card>
        <div className="project-panel-card-heading">
          <H5>New Invoice</H5>
          <Tag minimal>new</Tag>
          <div className="panel-card-buttons">
            <Button icon="plus" onClick={() => setOpen(true)} small text="Add Item" />
            <Button
              disabled={!state.items.length || isLoading}
              icon="tick"
              onClick={async () => {
                try {
                  await prepareInvoiceMutation({
                    customer: invoice.project.company.stripeId,
                    invoiceId: invoice.id,
                    items: state.items,
                  })
                  await invalidateQuery(getInvoices)
                  AppToaster?.show({ intent: 'success', message: 'Stripe invoice created.' })
                } catch ({ message }) {
                  AppToaster?.show({ intent: 'warning', message })
                }
              }}
              small
              text="Prepare Invoice"
            />
            <Button
              icon="minus"
              onClick={async () => {
                try {
                  await deleteInvoiceMutation({ id: invoice.id })
                  await invalidateQuery(getInvoices)
                  AppToaster?.show({ intent: 'success', message: 'Deleted invoice.' })
                } catch ({ message }) {
                  AppToaster?.show({ intent: 'warning', message })
                }
              }}
              small
              text="Delete Invoice"
            />
          </div>
        </div>

        {!!state.items.length && (
          <div className="data-grid invoices-grid">
            <H6>Actions</H6>
            <H6>Product</H6>
            <H6>Amount</H6>
            {!!state.items.length &&
              state.items.map((price_data, i) => (
                <PriceRow
                  priceDispatch={dispatch}
                  price_data={price_data}
                  key={i}
                  options={products}
                />
              ))}
            <div className="empty">Total: </div>
            <div className="total">{(total / 100.0).toFixed(2)}</div>
          </div>
        )}
      </Card>
    </>
  )
}
