import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation, useSession } from 'blitz'
import { AnchorButton, Button, Card, H5, H6, Tag } from '@blueprintjs/core'
import Stripe from 'stripe'

import { AppToaster } from '@components/Toaster'
import { PriceRow } from './PriceRow'

import { IPrice } from 'app/projects/types'
import finalizeInvoice from 'app/projects/mutations/finalizeInvoice'
import getInvoice from 'app/projects/queries/getInvoice'

export const StripeInvoice: FunctionComponent<{
  invoice: Stripe.Invoice & { subscription: Stripe.Subscription }
}> = ({ invoice }) => {
  const { roles } = useSession()
  const [finalizeInvoiceMutation, { isLoading }] = useMutation(finalizeInvoice)

  const total = invoice.lines.data.reduce((sum, { price }) => sum + price?.unit_amount!, 0)
  const getIntent = () => {
    switch (invoice.status) {
      case 'open':
        return 'primary'
      case 'paid':
        return 'success'
      default:
        return 'none'
    }
  }

  const handleFinalizeInvoice = async () => {
    try {
      await finalizeInvoiceMutation({ stripeId: invoice.id })
      await invalidateQuery(getInvoice)
      AppToaster?.show({ intent: 'success', message: 'Invoice finalized.' })
    } catch ({ message }) {
      AppToaster?.show({ intent: 'warning', message })
    }
  }

  return (
    <>
      <Card>
        <div className="project-panel-card-heading">
          <H5>Invoice sent to {invoice.customer_email}</H5>
          <Tag intent={getIntent()} minimal>
            {invoice.status}
          </Tag>

          <div className="panel-card-buttons">
            {invoice.status !== 'paid' &&
              invoice.status !== 'draft' &&
              !roles.includes('ADMIN') && (
                <AnchorButton
                  className="hosted-invoice-url"
                  icon="credit-card"
                  intent="success"
                  href={invoice.hosted_invoice_url!}
                  small
                  text="Pay Now"
                />
              )}
            {invoice.status === 'draft' && roles.includes('ADMIN') && (
              <Button
                disabled={isLoading}
                icon="tick"
                onClick={handleFinalizeInvoice}
                small
                text="Finalize Invoice"
              />
            )}
          </div>
        </div>

        <div className="data-grid stripe-invoices-grid">
          <H6>Product</H6>
          <H6>Amount</H6>
          {invoice.lines.data.map((item, i) => (
            <PriceRow price_data={item.price as IPrice} key={i} />
          ))}
          <div className="empty">Total: </div>
          <div className="total">{(total / 100.0).toFixed(2)}</div>
        </div>
      </Card>
    </>
  )
}
