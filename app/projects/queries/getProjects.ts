import db from 'db'
import { Ctx } from 'blitz'
import { GetProjects, GetProjectsType } from '../validations'

export default async function getProjects(params: GetProjectsType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const userPrivate = await ctx.session.getPrivateData()

  const { companyId, skip, take } = GetProjects.parse(params)

  const projects = await db.project.findMany({
    include: { company: true },
    orderBy: { updatedAt: 'desc' },
    skip,
    take,
    where: { companyId: userPrivate.companyId || companyId || undefined },
  })

  const count = await db.project.count({
    where: { companyId: userPrivate.companyId || companyId || undefined },
  })
  const hasMore = skip! + take! < count

  return { hasMore, projects }
}
