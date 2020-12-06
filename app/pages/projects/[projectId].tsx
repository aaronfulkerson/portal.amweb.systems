import { useState } from 'react'
import { useParam, useQuery } from 'blitz'
import { Breadcrumb, Breadcrumbs, IBreadcrumbProps, Tab, Tabs } from '@blueprintjs/core'

import { Layout } from 'app/layouts/Layout'
import { Overview } from 'app/projects/components/Overview'
import { Features } from 'app/projects/components/Features'
import { Issues } from 'app/projects/components/Issues'
import { Invoices } from 'app/projects/components/Invoices'

import { AmwebPage } from 'types'
import getProject from 'app/projects/queries/getProject'

const renderCurrentBreadcrumb = ({ text, ...props }: IBreadcrumbProps) => (
  <Breadcrumb {...props}>{text}</Breadcrumb>
)

const Project: AmwebPage = () => {
  const [tab, setTab] = useState('overview')
  const projectId = useParam('projectId', 'number') as number
  const [project] = useQuery(getProject, { projectId }, { enabled: projectId })

  const breadcrumbs: IBreadcrumbProps[] = [
    { href: '/projects', text: 'Projects' },
    { text: project?.repo },
  ]

  return (
    <div className="amweb-page">
      <Breadcrumbs currentBreadcrumbRenderer={renderCurrentBreadcrumb} items={breadcrumbs} />
      <Tabs
        animate
        large
        onChange={(tab) => setTab(tab.toString())}
        renderActiveTabPanelOnly
        selectedTabId={tab}
        vertical
      >
        <Tab id="overview" panel={<Overview project={project!} />} title="Overview" />
        <Tab id="features" panel={<Features project={project!} />} title="Features" />
        <Tab id="issues" panel={<Issues project={project!} />} title="Issues" />
        <Tab id="invoices" panel={<Invoices project={project!} />} title="Invoices" />
      </Tabs>
    </div>
  )
}

Project.getLayout = (page) => <Layout title="Project">{page}</Layout>

Project.allowed = ['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT']

export default Project
