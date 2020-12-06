import { Layout } from 'app/layouts/Layout'
import { useQuery } from 'blitz'

import { AmwebPage } from 'types'
import getProjects from 'app/projects/queries/getProjects'
import { Overview } from 'app/projects/components/Overview'
import { Card, Divider, H3 } from '@blueprintjs/core'

const Dashboard: AmwebPage = () => {
  const [{ projects }] = useQuery(getProjects, { skip: 0, take: 3 })

  return (
    <div className="amweb-page">
      {projects.map((project) => {
        return (
          <Card>
            <H3>
              {project.company.name}: {project.description}
            </H3>
            <Divider />
            <Overview project={project} />
          </Card>
        )
      })}
    </div>
  )
}

Dashboard.getLayout = (page) => <Layout title="Dashboard">{page}</Layout>

Dashboard.allowed = ['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT']

export default Dashboard
