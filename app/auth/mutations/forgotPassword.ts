import { Ctx } from 'blitz'
import db from 'db'
import { ForgotPassword, ForgotPasswordType } from '../validations'
import {
  generateToken,
  hashToken,
  RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS,
} from 'app/auth/auth-utils'
import { send } from 'lib/mailgun'

export default async function forgotPassword(params: ForgotPasswordType, _ctx: Ctx) {
  const { email } = ForgotPassword.parse(params)

  // 1. Get the user
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })

  // 2. Generate the token and expiration date.
  // We use encodeURIComponent(token) since it will be used in the URL
  const token = generateToken()
  const urlSafeToken = encodeURIComponent(token)
  const hashedToken = hashToken(token)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS)

  // 3. If user with this email was found
  if (user) {
    // 4. Delete any existing password reset tokens
    await db.token.deleteMany({ where: { type: 'RESET_PASSWORD', userId: user.id } })
    // 5. Save this new token in the database.
    await db.token.create({
      data: {
        user: { connect: { id: user.id } },
        type: 'RESET_PASSWORD',
        expiresAt,
        hashedToken,
        sentTo: user.email,
      },
    })
    // 6. Send the email
    const msg = {
      from: 'Aaron Fulkerson <aaron@amweb.systems>',
      to: [email],
      subject: 'Reset your password',
      text: `http://${process.env.DOMAIN}/auth/RESET_PASSWORD/${urlSafeToken}`,
      html: `http://${process.env.DOMAIN}/auth/RESET_PASSWORD/${urlSafeToken}`,
    }
    await send(msg)
  } else {
    // 7. If no user found wait the same time so attackers can't tell the difference
    await new Promise((resolve) => setTimeout(resolve, 750))
  }

  // 8. Return the same result whether a password reset email was sent or not
  return
}
