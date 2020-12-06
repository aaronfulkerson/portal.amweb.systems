import db from 'db'
import { Ctx } from 'blitz'

import { DeleteInvoice, DeleteInvoiceType } from '../validations'

export default async function deleteInvoiceItem(params: DeleteInvoiceType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id } = DeleteInvoice.parse(params)

  await db.invoice.deleteMany({ where: { id, stripeId: null } })
}
