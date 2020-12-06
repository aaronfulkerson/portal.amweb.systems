import { Prisma } from '@prisma/client'

export type UserWithCompany = Prisma.UserGetPayload<{ include: { company: true } }>
