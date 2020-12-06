import { ChangeEvent, FunctionComponent, useState } from 'react'
import { invalidateQuery, useQuery } from 'blitz'
import { Button, ButtonGroup, Dialog, NonIdealState, Switch } from '@blueprintjs/core'

import { Issue } from './Issue'
import { CreateIssueForm } from './CreateIssueForm'

import { ProjectWithCompany } from '../../types'
import getIssues from 'app/projects/queries/getIssues'
import getNotifications from 'app/queries/getNotifications'

const ITEMS_PER_PAGE = 5

export const Issues: FunctionComponent<{ project?: ProjectWithCompany }> = ({ project }) => {
  const [closed, setClosed] = useState(false)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<number>(0)
  const [{ hasMore, issues }] = useQuery(
    getIssues,
    {
      projectId: project?.id!,
      skip: ITEMS_PER_PAGE * page,
      take: ITEMS_PER_PAGE,
      closed,
    },
    { enabled: project, onSuccess: () => invalidateQuery(getNotifications) }
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
        <Button disabled={closed} icon="plus" onClick={() => setOpen(true)} text="Create Issue" />
        <Switch
          checked={closed}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setClosed(e.target.checked)}
          label="Show closed issues"
        />
      </div>

      <Dialog icon="plus" isOpen={open} onClose={() => setOpen(false)} title="New Issue">
        <CreateIssueForm close={() => setOpen(false)} projectId={project?.id} />
      </Dialog>

      {issues.length ? (
        issues.map((issue, i) => <Issue issue={issue} key={i} />)
      ) : (
        <NonIdealState icon="warning-sign" title={`No ${closed ? 'Closed ' : ''}Issues Yet`} />
      )}
    </>
  )
}
