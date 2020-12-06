import db from 'db'
import { Ctx } from 'blitz'
import { GetProject, GetProjectType } from '../validations'

export default async function getProject(params: GetProjectType, ctx: Ctx) {
  ctx.session.authorize(['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT'])
  const { companyId } = await ctx.session.getPrivateData()

  const { projectId } = GetProject.parse(params)

  return await db.project.findUnique({
    include: { company: true },
    where: {
      ...(companyId ? { id_companyId: { id: projectId, companyId } } : { id: projectId }),
    },
  })
}
