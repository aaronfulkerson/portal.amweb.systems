import db, { IssueNotificationCreateWithoutNotificationInput } from 'db'
import { Ctx } from 'blitz'
import { send } from 'lib/mailgun'

import { CreateIssue, CreateIssueType } from '../validations'

export default async function createIssue(params: CreateIssueType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()
  const { userId } = ctx.session

  const { description, projectId, title } = CreateIssue.parse(params)

  if (companyId) await db.project.findFirst({ where: { companyId, id: projectId } })

  const { id } = await db.issue.create({
    data: { description, title, project: { connect: { id: projectId } } },
  })
  await db.project.update({ data: { updatedAt: new Date() }, where: { id: projectId } })

  const users = await db.user.findMany({
    where: {
      id: { not: userId },
      settings: { emailNotifications: true },
      OR: [{ company: { projects: { some: { issues: { some: { id } } } } } }, { role: 'ADMIN' }],
    },
  })

  const issueNotifications: IssueNotificationCreateWithoutNotificationInput[] = users.map(
    ({ id: userId }) => ({ issue: { connect: { id } }, user: { connect: { id: userId } } })
  )

  if (!!issueNotifications.length) {
    await db.notification.create({
      data: { issueNotifications: { create: issueNotifications }, type: 'ISSUE' },
    })

    const project = await db.project.findUnique({ where: { id: projectId } })

    const to = users.map((user) => user.email)
    const msg = {
      from: 'Aaron Fulkerson <aaron@amweb.systems>',
      to,
      subject: 'New issue at AmWeb Systems',
      text: `There's a new issue. View it by following this link: http://${
        process.env.DOMAIN
      }/projects/${project!.id!}`,
      html: `There's a new issue. View it by following this link: http://${
        process.env.DOMAIN
      }/projects/${project!.id!}`,
    }
    await send(msg)
  }
}
