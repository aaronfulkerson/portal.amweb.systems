import db from 'db'
import { Ctx } from 'blitz'
import { stripe } from 'lib/stripe'

import { GetInvoice, GetInvoiceType } from '../validations'

export default async function getInvoice(params: GetInvoiceType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()
  const { userId } = ctx.session

  const { stripeId } = GetInvoice.parse(params)

  await db.invoiceNotification.updateMany({
    data: { seen: true },
    where: {
      invoice: { stripeId },
      userId,
    },
  })

  await db.invoice.findFirst({ where: { stripeId, ...(companyId && { project: { companyId } }) } })

  return await stripe.invoices.retrieve(stripeId, {
    expand: ['subscription', 'lines.data.price.product'],
  })
}
