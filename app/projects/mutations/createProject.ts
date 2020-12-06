import db from 'db'
import { Ctx } from 'blitz'

import { CreateProject, CreateProjectType } from '../validations'
// import octokit from 'lib/octokit'

export default async function createProject(params: CreateProjectType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { companyId, description, repo } = CreateProject.parse(params)

  // await octokit.repos.createForAuthenticatedUser({ name: repo })

  return await db.project.create({
    data: {
      company: { connect: { id: companyId } },
      description,
      repo,
    },
    include: { company: true },
  })
}
