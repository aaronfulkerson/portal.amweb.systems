import db from 'db'
import { Ctx } from 'blitz'
import { stripe } from 'lib/stripe'
import { send } from 'lib/mailgun'
import { generateToken, hashToken, SIGNUP_TOKEN_EXPIRATION_IN_HOURS } from 'app/auth/auth-utils'

import { CreateCompany, CreateCompanyType } from '../validations'

export default async function createCompany(params: CreateCompanyType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { email, name, userName } = CreateCompany.parse(params)

  const { id: stripeId } = await stripe.customers.create({ email, name })

  const token = generateToken()
  const urlSafeToken = encodeURIComponent(token)
  const hashedToken = hashToken(token)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SIGNUP_TOKEN_EXPIRATION_IN_HOURS)

  await db.company.create({
    data: {
      email,
      name,
      stripeId,
      users: {
        create: {
          defaultContact: true,
          email,
          name: userName,
          role: 'PRIVILEGED_CLIENT',
          settings: { create: { emailNotifications: true } },
          tokens: { create: { expiresAt, hashedToken, sentTo: email, type: 'SIGNUP' } },
        },
      },
    },
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
