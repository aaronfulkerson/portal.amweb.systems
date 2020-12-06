import db from 'db'
import { Ctx } from 'blitz'
import { CreateUser, CreateUserType } from '../validations'
import { generateToken, hashToken, SIGNUP_TOKEN_EXPIRATION_IN_HOURS } from 'app/auth/auth-utils'
import { send } from 'lib/mailgun'

export default async function createUser(params: CreateUserType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { companyId, email, name, role } = CreateUser.parse(params)

  const token = generateToken()
  const urlSafeToken = encodeURIComponent(token)
  const hashedToken = hashToken(token)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SIGNUP_TOKEN_EXPIRATION_IN_HOURS)

  await db.user.create({
    data: {
      company: { connect: { id: companyId } },
      email,
      name,
      role,
      settings: { create: { emailNotifications: true } },
      tokens: { create: { expiresAt, hashedToken, sentTo: email, type: 'SIGNUP' } },
    },
    include: { company: true },
  })

  const msg = {
    from: 'Aaron Fulkerson <aaron@amweb.systems>',
    to: [email],
    subject: 'Details about your new account',
    text: `Thanks for signing up. Follow the link in this email to finalize your account and set a password. http://${process.env.DOMAIN}/auth/SIGNUP/${urlSafeToken}`,
    html: `Thanks for signing up. Follow the link in this email to finalize your account and set a password. http://${process.env.DOMAIN}/auth/SIGNUP/${urlSafeToken}`,
  }
  await send(msg)
}
