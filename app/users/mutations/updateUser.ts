import db from 'db'
import { Ctx } from 'blitz'
import { UpdateUser, UpdateUserType } from '../validations'

export default async function updateUser(params: UpdateUserType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id, email, name, role } = UpdateUser.parse(params)

  return await db.user.update({
    data: { email, name, role },
    include: { company: true },
    where: { id },
  })
}
