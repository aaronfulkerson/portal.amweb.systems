import { FunctionComponent } from 'react'
import { invalidateQuery, useQuery } from 'blitz'
import Stripe from 'stripe'

import { StripeInvoice } from './StripeInvoice'
import { InvoicePlaceholder } from './InvoicePlaceholder'

import { InvoiceWithCompany } from 'app/projects/types'
import getInvoice from 'app/projects/queries/getInvoice'
import getNotifications from 'app/queries/getNotifications'

export const Invoice: FunctionComponent<{ invoice: InvoiceWithCompany }> = ({ invoice }) => {
  const [stripeInvoice]: [Stripe.Invoice & { subscription: Stripe.Subscription }, any] = useQuery(
    getInvoice,
    { stripeId: invoice?.stripeId! },
    { enabled: !!invoice.stripeId, onSuccess: () => invalidateQuery(getNotifications) }
  )

  return stripeInvoice ? (
    <StripeInvoice invoice={stripeInvoice} />
  ) : (
    <InvoicePlaceholder invoice={invoice} />
  )
}
