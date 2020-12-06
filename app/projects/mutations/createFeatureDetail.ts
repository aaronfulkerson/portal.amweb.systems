import db from 'db'
import { Ctx } from 'blitz'

import { CreateFeatureDetail, CreateFeatureDetailType } from '../validations'

export default async function createFeatureDetail(params: CreateFeatureDetailType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { description, featureId } = CreateFeatureDetail.parse(params)

  const updatedAt = new Date()

  return await db.feature.update({
    data: {
      featureDetails: { create: { description } },
      project: { update: { updatedAt } },
      updatedAt,
    },
    where: { id: featureId },
  })
}
