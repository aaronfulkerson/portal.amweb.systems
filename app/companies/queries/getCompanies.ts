import db from 'db'
import { Ctx } from 'blitz'
import { GetCompanies, GetCompaniesType } from '../validations'

export default async function getCompanies(params: GetCompaniesType, ctx: Ctx) {
  ctx.session.authorize('ADMIN')

  const { companyQuery, skip, take } = GetCompanies.parse(params)

  const companies = await db.company.findMany({
    orderBy: { name: 'desc' },
    skip,
    take,
    where: { name: { contains: companyQuery, mode: 'insensitive' } },
  })
  const count = await db.company.count({
    where: { name: { contains: companyQuery, mode: 'insensitive' } },
  })
  const hasMore = skip! + take! < count

  return { companies, hasMore }
}
