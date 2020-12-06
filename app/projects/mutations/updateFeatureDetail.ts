import db from 'db'
import { Ctx } from 'blitz'

import { UpdateFeatureDetail, UpdateFeatureDetailType } from '../validations'

export default async function updateFeatureDetail(params: UpdateFeatureDetailType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id, featureId, complete, description } = UpdateFeatureDetail.parse(params)

  const updatedAt = new Date()

  await db.feature.update({
    data: {
      featureDetails: { update: { data: { complete, description }, where: { id } } },
      project: { update: { updatedAt } },
      updatedAt,
    },
    where: { id: featureId },
  })
}
