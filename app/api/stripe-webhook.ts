import db from 'db'
import { MailgunMessage, send } from 'lib/mailgun'
import { stripe } from 'lib/stripe'
import Stripe from 'stripe'
import getRawBody from 'raw-body'

import { BlitzApiRequest, BlitzApiResponse } from 'blitz'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripeWebhook = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  try {
    const rawBody = await getRawBody(req)

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature'] as string,
      process.env.STRIPE_WEBHOOK_CLI! || process.env.STRIPE_WEBHOOK!
    )

    switch (stripeEvent.type) {
      case 'invoice.paid': {
        const { id: stripeId, paid } = stripeEvent.data.object as Stripe.Invoice
        const { project } = await db.invoice.update({
          data: { paid },
          include: { project: true },
          where: { stripeId },
        })
        const msg: MailgunMessage = {
          from: 'Aaron Fulkerson <aaron@amweb.systems>',
          to: ['aaron@amweb.systems'],
          subject: 'An invoice was paid',
          text: `The invoice for the following project was paid http://${process.env.DOMAIN}/projects/${project.id}`,
          html: `The invoice for the following project was paid http://${process.env.DOMAIN}/projects/${project.id}`,
        }
        await send(msg)
      }
    }

    res.send({ received: true })
  } catch (error) {
    res.send({ status: 'error', code: error.code, message: error.message })
  }
}

export default stripeWebhook
