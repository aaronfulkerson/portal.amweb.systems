import db from 'db'
import { Ctx } from 'blitz'

import { DeleteFeature, DeleteFeatureType } from '../validations'

export default async function deleteFeature(params: DeleteFeatureType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id } = DeleteFeature.parse(params)

  await db.commentNotification.deleteMany({ where: { comment: { feature: { some: { id } } } } })
  await db.comment.deleteMany({ where: { feature: { some: { id } } } })
  await db.notification.deleteMany({
    where: {
      commentNotifications: { every: { comment: { feature: { some: { id } } } } },
      type: 'COMMENT',
    },
  })
  await db.featureDetail.deleteMany({ where: { featureId: id } })
  await db.feature.delete({ where: { id } })
}
