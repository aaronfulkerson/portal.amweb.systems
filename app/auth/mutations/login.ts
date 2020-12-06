import { Ctx } from 'blitz'
import { authenticateUser, buildPublicData } from 'app/auth/auth-utils'
import { Login, LoginType } from '../validations'

export default async function login(params: LoginType, ctx: Ctx) {
  const { email, password } = Login.parse(params)

  const user = await authenticateUser(email, password)

  await ctx.session.create(buildPublicData({ userId: user.id, role: user.role }), {
    companyId: user.companyId,
    customerId: user.company?.stripeId,
  })

  return user
}
