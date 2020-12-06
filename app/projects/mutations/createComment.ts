import db, { CommentNotificationCreateWithoutNotificationInput } from 'db'
import { Ctx } from 'blitz'
import { send } from 'lib/mailgun'

import { CreateComment, CreateCommentType } from '../validations'

export default async function createComment(params: CreateCommentType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { userId } = ctx.session
  const { companyId } = await ctx.session.getPrivateData()

  const comment = CreateComment.parse(params)

  if (companyId !== null) {
    if ('featureId' in comment) await db.feature.findFirst({ where: { project: { companyId } } })
    if ('issueId' in comment) await db.issue.findFirst({ where: { project: { companyId } } })
  }

  const { id: commentId } = await db.comment.create({
    data: {
      ...('featureId' in comment && { feature: { connect: { id: comment.featureId } } }),
      ...('issueId' in comment && { issue: { connect: { id: comment.issueId } } }),
      user: { connect: { id: userId } },
      value: comment.value,
    },
  })

  const users = await db.user.findMany({
    where: {
      id: { not: userId },
      settings: { emailNotifications: true },
      OR: [
        {
          comments: {
            some: {
              ...('featureId' in comment && { feature: { some: { id: comment.featureId } } }),
              ...('issueId' in comment && { issue: { some: { id: comment.issueId } } }),
            },
          },
        },
        { role: 'ADMIN' },
      ],
      NOT: {
        commentNotifications: {
          some: {
            comment: {
              ...('featureId' in comment && { feature: { some: { id: comment.featureId } } }),
              ...('issueId' in comment && { issue: { some: { id: comment.issueId } } }),
            },
            seen: false,
          },
        },
      },
    },
  })

  const commentNotifications: CommentNotificationCreateWithoutNotificationInput[] = users.map(
    ({ id: userId }) => ({
      comment: { connect: { id: commentId } },
      user: { connect: { id: userId } },
    })
  )

  if (!!commentNotifications.length) {
    await db.notification.create({
      data: { commentNotifications: { create: commentNotifications }, type: 'COMMENT' },
    })

    const project = await db.project.findFirst({
      where: {
        ...('featureId' in comment && { features: { some: { id: comment.featureId } } }),
        ...('issueId' in comment && { issues: { some: { id: comment.issueId } } }),
      },
    })

    const to = users.map((user) => user.email)
    const msg = {
      from: 'Aaron Fulkerson <aaron@amweb.systems>',
      to,
      subject: 'New message at AmWeb Systems',
      text: `There's a new message. View it by following this link: http://${
        process.env.DOMAIN
      }/projects/${project!.id!}`,
      html: `There's a new message. View it by following this link: http://${
        process.env.DOMAIN
      }/projects/${project!.id!}`,
    }
    await send(msg)
  }
}
