import * as z from 'zod'

export const GetUsers = z.object({
  companyId: z.number().optional(),
  userQuery: z.string().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})
export type GetUsersType = z.infer<typeof GetUsers>

export const CreateUser = z.object({
  companyId: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['BASIC_CLIENT', 'PRIVILEGED_CLIENT']),
})
export type CreateUserType = z.infer<typeof CreateUser>

export const UpdateUser = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: z.enum(['BASIC_CLIENT', 'PRIVILEGED_CLIENT']).optional(),
})
export type UpdateUserType = z.infer<typeof UpdateUser>
