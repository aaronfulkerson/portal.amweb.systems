import * as z from 'zod'

export const CreateProduct = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.enum(['monthly', 'service']),
})
export type CreateProductType = z.infer<typeof CreateProduct>

export const UpdateProduct = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(['monthly', 'service']).optional(),
})
export type UpdateProductType = z.infer<typeof UpdateProduct>

export const DeleteProduct = z.object({
  id: z.string(),
})
export type DeleteProductType = z.infer<typeof DeleteProduct>
