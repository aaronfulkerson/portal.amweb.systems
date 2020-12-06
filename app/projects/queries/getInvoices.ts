import db from 'db'
import { Ctx } from 'blitz'

import { GetInvoices, GetInvoicesType } from '../validations'

export default async function getInvoices(params: GetInvoicesType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const privateData = await ctx.session.getPrivateData()

  const { companyId, projectId, hasStripeId, paid, skip, take } = GetInvoices.parse(params)

  const invoices = await db.invoice.findMany({
    include: { project: { include: { company: true } } },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    where: {
      paid,
      ...(companyId && { project: { companyId } }),
      ...(privateData.companyId && { project: { companyId: privateData.companyId } }),
      ...(projectId && {
        project: {
          ...(privateData.companyId && { companyId: privateData.companyId }),
          id: projectId,
        },
      }),
      ...((hasStripeId || privateData.companyId) && { stripeId: { not: null } }),
    },
  })

  const count = await db.invoice.count({
    where: {
      paid,
      ...(companyId && { project: { companyId } }),
      ...(privateData.companyId && { project: { companyId: privateData.companyId } }),
      ...(projectId && {
        project: {
          ...(privateData.companyId && { companyId: privateData.companyId }),
          id: projectId,
        },
      }),
      ...((hasStripeId || privateData.companyId) && { stripeId: { not: null } }),
    },
  })
  const hasMore = skip! + take! < count

  return { hasMore, invoices }
}
