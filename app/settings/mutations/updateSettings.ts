import db from 'db'
import { Ctx } from 'blitz'
import { UpdateSettings, UpdateSettingsType } from '../validations'

export default async function updateSettings(params: UpdateSettingsType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { userId } = ctx.session

  const { emailNotifications } = UpdateSettings.parse(params)

  return await db.user.update({
    data: { settings: { update: { emailNotifications } } },
    where: { id: userId },
  })
}
