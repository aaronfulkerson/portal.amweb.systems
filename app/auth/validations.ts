import * as z from 'zod'

const password = z.string().min(10).max(100)

export const Login = z.object({
  email: z.string().email(),
  password: z.string(),
})
export type LoginType = z.infer<typeof Login>

export const CreatePassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
    type: z.enum(['RESET_PASSWORD', 'SIGNUP']),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'], // set the path of the error
  })
export type CreatePasswordType = z.infer<typeof CreatePassword>

export const UpdatePassword = z
  .object({
    currentPassword: z.string(),
    newPassword: password,
    passwordConfirmation: password,
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'], // set the path of the error
  })
export type UpdatePasswordType = z.infer<typeof UpdatePassword>

export const ForgotPassword = z.object({
  email: z.string().email(),
})
export type ForgotPasswordType = z.infer<typeof ForgotPassword>
