import { Ctx } from 'blitz'
import { stripe } from 'lib/stripe'

export default async function createProduct(_: undefined, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  return await stripe.products.list()
}
