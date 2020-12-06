import db, { InvoiceNotificationCreateWithoutNotificationInput } from 'db'
import { Ctx } from 'blitz'
import Stripe from 'stripe'
import { stripe } from 'lib/stripe'
import { send } from 'lib/mailgun'

import { PrepareInvoice, PrepareInvoiceType } from '../validations'
import { IPrice } from '../types'

const createSubscription = async (customer: string, items: IPrice[]) => {
  const { latest_invoice } = await stripe.subscriptions.create({
    customer,
    collection_method: 'send_invoice',
    days_until_due: 7,
    items: items
      .filter((i) => !!i.recurring)
      .map((i) => ({
        price_data: {
          currency: 'usd',
          product: i.product.id,
          recurring: i.recurring as Stripe.Price.Recurring,
          unit_amount: i.unit_amount,
        },
      })),
    add_invoice_items: items
      .filter((i) => !i.recurring)
      .map((i) => ({
        price_data: { currency: 'usd', product: i.product.id, unit_amount: i.unit_amount },
      })),
  })
  return latest_invoice as string
}

const createInvoice = async (customer: string, items: IPrice[]) => {
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer,
      price_data: { currency: 'usd', product: item.product.id, unit_amount: item.unit_amount },
    })
  }
  const { id } = await stripe.invoices.create({
    customer,
    collection_method: 'send_invoice',
    days_until_due: 7,
  })
  return id
}

export default async function prepareInvoice(params: PrepareInvoiceType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { customer, invoiceId, items } = PrepareInvoice.parse(params)

  const hasSubscriptionItems = items.some((i) => !!i.recurring)

  const stripeId = hasSubscriptionItems
    ? await createSubscription(customer, items)
    : await createInvoice(customer, items)

  const users = await db.user.findMany({
    where: {
      company: { projects: { some: { invoices: { some: { id: invoiceId } } } } },
      role: 'PRIVILEGED_CLIENT',
      settings: { emailNotifications: true },
    },
  })

  const invoiceNotifications: InvoiceNotificationCreateWithoutNotificationInput[] = users.map(
    ({ id: userId }) => ({
      invoice: { connect: { id: invoiceId } },
      user: { connect: { id: userId } },
    })
  )

  if (!!invoiceNotifications.length) {
    await db.notification.create({
      data: { invoiceNotifications: { create: invoiceNotifications }, type: 'INVOICE' },
    })

    const { projectId } = await db.invoice.update({
      data: { project: { update: { updatedAt: new Date() } }, stripeId },
      where: { id: invoiceId },
    })

    const to = users.map((user) => user.email)
    const msg = {
      from: 'Aaron Fulkerson <aaron@amweb.systems>',
      to,
      subject: 'New invoice at AmWeb Systems',
      text: `There's a new invoice. View it by following this link: http://${process.env.DOMAIN}/projects/${projectId}`,
      html: `There's a new invoice. View it by following this link: http://${process.env.DOMAIN}/projects/${projectId}`,
    }
    await send(msg)
  }
}
