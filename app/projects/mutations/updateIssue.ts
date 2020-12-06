import db from 'db'
import { Ctx } from 'blitz'

import { UpdateIssue, UpdateIssueType } from '../validations'

export default async function updateIssue(params: UpdateIssueType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()

  const { id, projectId, closed, description, title } = UpdateIssue.parse(params)

  if (companyId)
    await db.project.findFirst({ where: { companyId, id: projectId, issues: { some: { id } } } })

  const updatedAt = new Date()

  return await db.issue.update({
    data: { closed, description, project: { update: { updatedAt } }, title, updatedAt },
    where: { id },
  })
}
