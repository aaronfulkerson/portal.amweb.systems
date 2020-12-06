import { Ctx } from 'blitz'

import { CreateProduct, CreateProductType } from '../validations'
import { stripe } from 'lib/stripe'

export default async function createProduct(params: CreateProductType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id, name, type } = CreateProduct.parse(params)

  await stripe.products.create({ id, metadata: { type }, name })
}
