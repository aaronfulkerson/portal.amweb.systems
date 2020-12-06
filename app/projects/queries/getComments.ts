import db from 'db'
import { Ctx } from 'blitz'

import { GetComments, GetCommentsType } from '../validations'

export default async function getComments(params: GetCommentsType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()
  const { userId } = ctx.session

  const comments = GetComments.parse(params)

  await db.commentNotification.updateMany({
    data: { seen: true },
    where: {
      comment: {
        ...('featureId' in comments && {
          feature: {
            some: { id: comments.featureId, ...(companyId && { project: { companyId } }) },
          },
        }),
        ...('issueId' in comments && {
          issue: { some: { id: comments.issueId, ...(companyId && { project: { companyId } }) } },
        }),
      },
      userId,
    },
  })

  return await db.comment.findMany({
    include: { user: true },
    orderBy: { id: 'asc' },
    where: {
      ...('featureId' in comments && {
        feature: {
          some: {
            id: comments.featureId,
            ...(companyId && { project: { companyId } }),
          },
        },
      }),
      ...('issueId' in comments && {
        issue: {
          some: {
            id: comments.issueId,
            ...(companyId && { project: { companyId } }),
          },
        },
      }),
    },
  })
}
