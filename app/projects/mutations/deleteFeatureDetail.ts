import db from 'db'
import { Ctx } from 'blitz'

import { DeleteFeatureDetail, DeleteFeatureDetailType } from '../validations'

export default async function deleteFeatureDetail(params: DeleteFeatureDetailType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id } = DeleteFeatureDetail.parse(params)

  await db.featureDetail.deleteMany({ where: { id, complete: false } })
}
