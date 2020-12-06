import { Ctx } from 'blitz'
import { stripe } from 'lib/stripe'

import { FinalizeInvoice, FinalizeInvoiceType } from '../validations'

export default async function finalizeInvoice(params: FinalizeInvoiceType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { stripeId } = FinalizeInvoice.parse(params)

  await stripe.invoices.finalizeInvoice(stripeId)
}
