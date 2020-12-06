import * as z from 'zod'

export const GetCompanies = z.object({
  companyQuery: z.string().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})
export type GetCompaniesType = z.infer<typeof GetCompanies>

export const CreateCompany = z.object({
  email: z.string().email(),
  name: z.string(),
  userName: z.string(),
})
export type CreateCompanyType = z.infer<typeof CreateCompany>

export const UpdateCompany = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  name: z.string().optional(),
})
export type UpdateCompanyType = z.infer<typeof UpdateCompany>
