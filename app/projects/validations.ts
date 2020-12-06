import * as z from 'zod'

export const GetProject = z.object({
  projectId: z.number(),
})
export type GetProjectType = z.infer<typeof GetProject>

export const GetProjects = z.object({
  companyId: z.number().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})
export type GetProjectsType = z.infer<typeof GetProjects>

export const CreateProject = z.object({
  companyId: z.number(),
  description: z.string(),
  repo: z.string(),
})
export type CreateProjectType = z.infer<typeof CreateProject>

export const UpdateProject = z.object({
  id: z.number(),
  complete: z.boolean().optional(),
  description: z.string(),
  repo: z.string(),
})
export type UpdateProjectType = z.infer<typeof UpdateProject>

export const GetOverview = z.object({
  id: z.number(),
})
export type GetOverviewType = z.infer<typeof GetOverview>

export const GetFeatures = z.object({
  projectId: z.number(),
  skip: z.number().optional(),
  take: z.number().optional(),
  complete: z.boolean().optional(),
})
export type GetFeaturesType = z.infer<typeof GetFeatures>

export const CreateFeature = z.object({
  projectId: z.number(),
  description: z.string(),
  title: z.string(),
})
export type CreateFeatureType = z.infer<typeof CreateFeature>

export const UpdateFeature = z.object({
  id: z.number(),
  complete: z.boolean().optional(),
  description: z.string().optional(),
  title: z.string().optional(),
})
export type UpdateFeatureType = z.infer<typeof UpdateFeature>

export const DeleteFeature = z.object({
  id: z.number(),
})
export type DeleteFeatureType = z.infer<typeof DeleteFeature>

export const CreateFeatureDetail = z.object({
  featureId: z.number(),
  description: z.string(),
})
export type CreateFeatureDetailType = z.infer<typeof CreateFeatureDetail>

export const UpdateFeatureDetail = z.object({
  id: z.number(),
  featureId: z.number(),
  complete: z.boolean().optional(),
  description: z.string().optional(),
})
export type UpdateFeatureDetailType = z.infer<typeof UpdateFeatureDetail>

export const DeleteFeatureDetail = z.object({
  id: z.number(),
})
export type DeleteFeatureDetailType = z.infer<typeof DeleteFeatureDetail>

export const GetIssues = z.object({
  projectId: z.number(),
  skip: z.number().optional(),
  take: z.number().optional(),
  closed: z.boolean().optional(),
})
export type GetIssuesType = z.infer<typeof GetIssues>

export const CreateIssue = z.object({
  projectId: z.number(),
  description: z.string(),
  title: z.string(),
})
export type CreateIssueType = z.infer<typeof CreateIssue>

export const UpdateIssue = z.object({
  id: z.number(),
  projectId: z.number(),
  description: z.string().optional(),
  closed: z.boolean().optional(),
  title: z.string().optional(),
})
export type UpdateIssueType = z.infer<typeof UpdateIssue>

export const DeleteIssue = z.object({
  id: z.number(),
})
export type DeleteIssueType = z.infer<typeof DeleteIssue>

export const GetComments = z.union([
  z.object({ featureId: z.number() }),
  z.object({ issueId: z.number() }),
])
export type GetCommentsType = z.infer<typeof GetComments>

export const CreateComment = z.union([
  z.object({ featureId: z.number(), value: z.string() }),
  z.object({ issueId: z.number(), value: z.string() }),
])
export type CreateCommentType = z.infer<typeof CreateComment>

export const GetInvoices = z.object({
  companyId: z.number().optional(),
  projectId: z.number().optional(),
  hasStripeId: z.boolean().optional(),
  paid: z.boolean().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})
export type GetInvoicesType = z.infer<typeof GetInvoices>

export const GetInvoice = z.object({
  stripeId: z.string(),
})
export type GetInvoiceType = z.infer<typeof GetInvoice>

export const CreateInvoice = z.object({
  projectId: z.number(),
})
export type CreateInvoiceType = z.infer<typeof CreateInvoice>

export const DeleteInvoice = z.object({
  id: z.number(),
})
export type DeleteInvoiceType = z.infer<typeof DeleteInvoice>

export const PrepareInvoice = z.object({
  customer: z.string(),
  invoiceId: z.number(),
  items: z.array(
    z.object({
      product: z.object({
        id: z.string(),
        name: z.string(),
      }),
      recurring: z
        .object({
          interval: z.enum(['day', 'week', 'month', 'year']),
          interval_count: z.number(),
        })
        .optional(),
      unit_amount: z.number(),
    })
  ),
})
export type PrepareInvoiceType = z.infer<typeof PrepareInvoice>

export const FinalizeInvoice = z.object({
  stripeId: z.string(),
})
export type FinalizeInvoiceType = z.infer<typeof FinalizeInvoice>

export const AddPrice = z.object({
  product: z.string(),
  recurring: z.boolean(),
  unit_amount: z.transformer(z.string(), z.number().min(1), (v) => Math.floor(parseFloat(v) * 100)),
})
export type AddPriceType = z.infer<typeof AddPrice>

export const EditPrice = z.object({
  product: z.string(),
  recurring: z.boolean(),
  unit_amount: z.transformer(z.string(), z.number().min(1), (v) => Math.floor(parseFloat(v) * 100)),
})
export type EditPriceType = z.infer<typeof EditPrice>
