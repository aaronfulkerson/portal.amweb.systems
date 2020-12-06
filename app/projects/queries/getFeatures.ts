import db from 'db'
import { Ctx } from 'blitz'

import { GetFeatures, GetFeaturesType } from '../validations'

export default async function getFeatures(params: GetFeaturesType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()

  const { projectId, skip, take, complete } = GetFeatures.parse(params)

  const features = await db.feature.findMany({
    include: { featureDetails: { orderBy: { id: 'asc' } } },
    orderBy: { id: 'asc' },
    skip,
    take,
    where: { projectId, project: { companyId: companyId || undefined }, complete },
  })

  const count = await db.feature.count({
    where: { projectId, project: { companyId: companyId || undefined }, complete },
  })
  const hasMore = skip! + take! < count

  return { features, hasMore }
}
