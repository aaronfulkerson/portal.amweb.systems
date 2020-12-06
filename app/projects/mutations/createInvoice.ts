import db from 'db'
import { Ctx } from 'blitz'

import { CreateInvoice, CreateInvoiceType } from '../validations'

export default async function createInvoice(params: CreateInvoiceType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { projectId } = CreateInvoice.parse(params)

  return await db.invoice.create({
    data: { project: { connect: { id: projectId } } },
  })
}
