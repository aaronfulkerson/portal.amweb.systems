import db from 'db'
import { Ctx } from 'blitz'
import { GetOverview, GetOverviewType } from '../validations'

export default async function getOverview(params: GetOverviewType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()

  const { id } = GetOverview.parse(params)

  const feature = await db.feature.findFirst({
    include: { featureDetails: { orderBy: { id: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
    where: { project: { id, companyId: companyId || undefined } },
  })

  const invoice = await db.invoice.findFirst({
    orderBy: { id: 'desc' },
    where: {
      paid: false,
      project: { id, companyId: companyId || undefined },
      stripeId: { not: null },
    },
  })

  const issue = await db.issue.findFirst({
    orderBy: { updatedAt: 'desc' },
    where: { project: { id, companyId: companyId || undefined } },
  })

  return { feature, invoice, issue }
}
