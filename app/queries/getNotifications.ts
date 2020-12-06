import db from 'db'
import { Ctx } from 'blitz'

export default async function getNotifications(_: undefined, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { userId } = ctx.session

  return await db.notification.findMany({
    include: {
      commentNotifications: {
        include: { comment: { include: { feature: true, issue: true } } },
        where: { seen: false, userId },
      },
      invoiceNotifications: { include: { invoice: true }, where: { seen: false, userId } },
      issueNotifications: { include: { issue: true }, where: { seen: false, userId } },
    },
    where: {
      OR: [
        { commentNotifications: { some: { seen: false, userId } } },
        { invoiceNotifications: { some: { seen: false, userId } } },
        { issueNotifications: { some: { seen: false, userId } } },
      ],
    },
  })
}
