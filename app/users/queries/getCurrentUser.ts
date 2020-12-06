import db from 'db'
import { Ctx } from 'blitz'

export default async function getCurrentUser(_: undefined, ctx: Ctx) {
  if (!ctx.session.userId) return null

  return await db.user.findUnique({
    where: { id: ctx.session!.userId },
    select: { id: true, name: true, email: true, role: true },
  })
}
