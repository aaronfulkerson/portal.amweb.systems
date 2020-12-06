import db from 'db'
import { Ctx } from 'blitz'
import { UpdateCompany, UpdateCompanyType } from '../validations'

export default async function updateCompany(params: UpdateCompanyType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { id, email, name } = UpdateCompany.parse(params)

  return await db.company.update({
    data: { email, name },
    where: { id },
  })
}
