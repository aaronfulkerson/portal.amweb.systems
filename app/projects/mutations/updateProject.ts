import db from 'db'
import { Ctx } from 'blitz'

import { UpdateProject, UpdateProjectType } from '../validations'

export default async function updateProject(params: UpdateProjectType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id, complete, description, repo } = UpdateProject.parse(params)

  return await db.project.update({
    data: { complete, description, repo, updatedAt: new Date() },
    include: { company: true },
    where: { id },
  })
}
