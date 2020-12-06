import db from 'db'
import { Ctx } from 'blitz'

import { UpdateFeature, UpdateFeatureType } from '../validations'

export default async function updateFeature(params: UpdateFeatureType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id, complete, description, title } = UpdateFeature.parse(params)

  return await db.feature.update({
    data: { complete, description, project: { update: { updatedAt: new Date() } }, title },
    include: { featureDetails: true },
    where: { id },
  })
}
