import db from 'db'
import { Ctx } from 'blitz'

import { CreateFeature, CreateFeatureType } from '../validations'

export default async function createFeature(params: CreateFeatureType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { description, projectId, title } = CreateFeature.parse(params)

  await db.project.update({
    data: { features: { create: { description, title } }, updatedAt: new Date() },
    where: { id: projectId },
  })
}
