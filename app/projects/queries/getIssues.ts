import db from 'db'
import { Ctx } from 'blitz'

import { GetIssues, GetIssuesType } from '../validations'

export default async function getIssues(params: GetIssuesType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()
  const { userId } = ctx.session

  const { projectId, skip, take, closed } = GetIssues.parse(params)

  await db.issueNotification.updateMany({
    data: { seen: true },
    where: {
      issue: { projectId },
      userId,
    },
  })

  const issues = await db.issue.findMany({
    orderBy: { id: 'asc' },
    skip,
    take,
    where: { closed, projectId, project: { companyId: companyId || undefined } },
  })

  const count = await db.issue.count({
    where: { closed, projectId, project: { companyId: companyId || undefined } },
  })
  const hasMore = skip! + take! < count

  return { hasMore, issues }
}
