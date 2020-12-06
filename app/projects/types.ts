import { Prisma } from '@prisma/client'
import Stripe from 'stripe'

export type ProjectWithCompany = Prisma.ProjectGetPayload<{ include: { company: true } }>
export type FeatureWithFeatureDetails = Prisma.FeatureGetPayload<{
  include: { featureDetails: true }
}>
export type CommentWithUser = Prisma.CommentGetPayload<{ include: { user: true } }>
export type InvoiceWithCompany = Prisma.InvoiceGetPayload<{
  include: { project: { include: { company: true } } }
}>

export interface IPrice {
  product: Pick<Stripe.Product, 'id' | 'name'>
  recurring?: Pick<Stripe.Price.Recurring, 'interval' | 'interval_count'>
  unit_amount: number
}
