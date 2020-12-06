import db from 'db'
import { Ctx } from 'blitz'
import { GetUsers, GetUsersType } from '../validations'

export default async function getUsers(params: GetUsersType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { companyId, userQuery, skip, take } = GetUsers.parse(params)

  const users = await db.user.findMany({
    include: { company: true },
    orderBy: { name: 'desc' },
    skip,
    take,
    where: {
      company: { id: companyId },
      OR: [
        { email: { contains: userQuery, mode: 'insensitive' } },
        { name: { contains: userQuery, mode: 'insensitive' } },
      ],
      role: { not: 'ADMIN' },
    },
  })

  const count = await db.user.count({
    where: {
      company: { id: companyId },
      OR: [
        { email: { contains: userQuery, mode: 'insensitive' } },
        { name: { contains: userQuery, mode: 'insensitive' } },
      ],
      role: { not: 'ADMIN' },
    },
  })
  const hasMore = skip! + take! < count

  return { hasMore, users }
}
