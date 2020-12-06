import db from 'db'
import { Ctx } from 'blitz'

export default async function getSettings(_: undefined, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { userId } = ctx.session

  return await db.user.findUnique({ include: { settings: true }, where: { id: userId } })
}
