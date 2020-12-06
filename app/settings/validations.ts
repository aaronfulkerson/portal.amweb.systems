import * as z from 'zod'

export const UpdateSettings = z.object({
  emailNotifications: z.boolean().optional(),
})
export type UpdateSettingsType = z.infer<typeof UpdateSettings>
