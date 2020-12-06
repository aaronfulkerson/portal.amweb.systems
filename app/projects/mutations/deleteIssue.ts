import db from 'db'
import { Ctx } from 'blitz'

import { DeleteIssue, DeleteIssueType } from '../validations'

export default async function deleteIssue(params: DeleteIssueType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id } = DeleteIssue.parse(params)

  await db.commentNotification.deleteMany({ where: { comment: { issue: { some: { id } } } } })
  await db.comment.deleteMany({ where: { issue: { some: { id } } } })
  await db.issueNotification.deleteMany({ where: { issueId: id } })
  await db.notification.deleteMany({
    where: {
      OR: [
        {
          commentNotifications: { every: { comment: { issue: { some: { id } } } } },
          type: 'COMMENT',
        },
        {
          issueNotifications: { every: { issueId: id } },
          type: 'ISSUE',
        },
      ],
    },
  })
  return await db.issue.delete({ where: { id } })
}
