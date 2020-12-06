import { stripe } from 'lib/stripe'
import { Ctx } from 'blitz'

import { DeleteProduct, DeleteProductType } from '../validations'

export default async function deleteProduct(params: DeleteProductType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id } = DeleteProduct.parse(params)

  await stripe.products.del(id)
}
