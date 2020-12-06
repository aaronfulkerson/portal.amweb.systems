import { ChangeEvent, FunctionComponent, useState } from 'react'
import { useQuery, useSession } from 'blitz'
import { Button, ButtonGroup, Dialog, NonIdealState, Switch } from '@blueprintjs/core'

import { Feature } from './Feature'
import { CreateFeatureForm } from './CreateFeatureForm'

import { ProjectWithCompany } from '../../types'
import getFeatures from '../../queries/getFeatures'

const ITEMS_PER_PAGE = 5

export const Features: FunctionComponent<{ project: ProjectWithCompany }> = ({ project }) => {
  const { roles } = useSession()
  const [complete, setComplete] = useState(false)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<number>(0)
  const [{ features, hasMore }] = useQuery(
    getFeatures,
    {
      projectId: project?.id!,
      complete,
      skip: ITEMS_PER_PAGE * page,
      take: ITEMS_PER_PAGE,
    },
    { enabled: project }
  )

  const previousPage = () => setPage(page - 1)
  const nextPage = () => setPage(page + 1)

  return (
    <>
      <div className="project-tab-controls">
        <ButtonGroup className="pagination">
          <Button disabled={page <= 0} onClick={previousPage} icon="arrow-left" />
          <Button disabled={!hasMore} onClick={nextPage} icon="arrow-right" />
        </ButtonGroup>
        {roles.includes('ADMIN') && (
          <Button
            disabled={complete}
            icon="plus"
            onClick={() => setOpen(true)}
            text="Create Feature"
          />
        )}
        <Switch
          checked={complete}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setComplete(e.target.checked)}
          label="Show completed features"
        />
      </div>

      <Dialog icon="plus" isOpen={open} onClose={() => setOpen(false)} title="Create Feature">
        <CreateFeatureForm close={() => setOpen(false)} projectId={project?.id} />
      </Dialog>

      {features.length ? (
        features.map((feature, i) => <Feature feature={feature} key={i} />)
      ) : (
        <NonIdealState
          icon="warning-sign"
          title={`No ${complete ? 'completed ' : ''}Features Yet`}
        />
      )}
    </>
  )
}
