import { FunctionComponent } from 'react'
import { useQuery } from 'blitz'
import { H4, H5, Tag } from '@blueprintjs/core'
import Stripe from 'stripe'

import { Feature } from './Features/Feature'
import { Issue } from './Issues/Issue'
import { StripeInvoice } from './Invoices/StripeInvoice'

import { ProjectWithCompany } from '../types'
import getOverview from '../queries/getOverview'
import getInvoice from '../queries/getInvoice'

export const Overview: FunctionComponent<{ project?: ProjectWithCompany }> = ({ project }) => {
  const [{ feature, invoice, issue }] = useQuery(getOverview, { id: project?.id! })
  const [stripeInvoice]: [Stripe.Invoice & { subscription: Stripe.Subscription }, any] = useQuery(
    getInvoice,
    { stripeId: invoice?.stripeId! },
    { enabled: invoice?.stripeId }
  )

  return (
    <div className="project-overview">
      <H4>Summary</H4>
      <div className="data-grid overview-grid">
        <div className="left-border right-border">Description</div>
        <div className="left-border right-border">{project?.description}</div>
        <div className="left-border right-border">Git Repository</div>
        <div className="left-border right-border">{project?.repo}</div>
        <div className="left-border right-border">App Location</div>
        <div className="left-border right-border">{project?.appUrl}</div>
        <div className="left-border right-border">Preview URL</div>
        <div className="left-border right-border">{project?.previewUrl}</div>
        <div className="left-border right-border">Completion Status</div>
        <div className="left-border right-border">
          <Tag intent={!!project?.complete ? 'success' : 'warning'}>
            {!!project?.complete ? 'complete' : 'in-progress'}
          </Tag>
        </div>
      </div>
      <H4>Recent Activity</H4>

      {invoice ? <StripeInvoice invoice={stripeInvoice} /> : <H5>No invoices...</H5>}

      {feature ? <Feature feature={feature} overview /> : <H5>No features...</H5>}

      {issue ? <Issue issue={issue} overview /> : <H5>No issues...</H5>}
    </div>
  )
}
