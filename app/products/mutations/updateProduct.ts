import { Ctx } from 'blitz'

import { CreateProductType, UpdateProduct } from '../validations'
import { stripe } from 'lib/stripe'

export default async function updateProduct(params: CreateProductType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id, name, type } = UpdateProduct.parse(params)

  await stripe.products.update(id, { ...(type && { metadata: { type } }), name })
}
