import { ChangeEvent, FunctionComponent, useReducer, useState } from 'react'
import { invalidateQuery, useMutation, useSession } from 'blitz'
import { Button, Card, Classes, Dialog, Drawer, H5, IconName, Switch, Tag } from '@blueprintjs/core'

import { AppToaster } from '@components/Toaster'
import { DiscussionThread } from '../DiscussionThread'
import { UpdateIssueForm } from './UpdateIssueForm'

import PrismaClient from '@prisma/client'
import updateIssue from 'app/projects/mutations/updateIssue'
import deleteIssue from 'app/projects/mutations/deleteIssue'
import getIssues from 'app/projects/queries/getIssues'

const initialState = { action: undefined, icon: undefined, open: false, title: undefined }

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ISSUE':
      return { action: action.type, icon: 'edit', open: true, title: 'Update Issue' }
    case 'DELETE_ISSUE':
      return { action: action.type, icon: 'trash', open: true, title: 'Delete Issue' }
    case 'CLOSE':
      return initialState
  }
}

export const Issue: FunctionComponent<{ issue: PrismaClient.Issue; overview?: boolean }> = ({
  issue,
  overview,
}) => {
  const { roles } = useSession()
  const [updateIssueMutation] = useMutation(updateIssue)
  const [deleteIssueMutation] = useMutation(deleteIssue)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [open, setOpen] = useState(false)

  const handleDeleteFeature = async () => {
    try {
      await deleteIssueMutation({ id: issue.id })
      await invalidateQuery(getIssues)
      dispatch({ type: 'CLOSE' })
      AppToaster?.show({ intent: 'success', message: 'Issue deleted.' })
    } catch ({ message }) {
      AppToaster?.show({ intent: 'warning', message })
    }
  }

  const handleCloseIssue = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const status = e.target.checked ? 'closed' : 'open'
      await updateIssueMutation({
        id: issue.id,
        projectId: issue.projectId,
        closed: e.target.checked,
      })
      await invalidateQuery(getIssues)
      dispatch({ type: 'CLOSE' })
      AppToaster?.show({ intent: 'success', message: `Issue ${status}.` })
    } catch ({ message }) {
      AppToaster?.show({ intent: 'warning', message })
    }
  }

  return (
    <>
      <Drawer
        icon="chat"
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`Discusson: ${issue.description}`}
      >
        <DiscussionThread issueId={issue.id} />
      </Drawer>

      <Dialog
        icon={state?.icon as IconName}
        isOpen={state?.open}
        onClose={() => dispatch({ type: 'CLOSE' })}
        title={state?.title + (issue && ': ' + issue.title)}
      >
        {state?.action === 'UPDATE_ISSUE' && (
          <UpdateIssueForm close={() => dispatch({ type: 'CLOSE' })} issue={issue} />
        )}

        {state?.action === 'DELETE_ISSUE' && (
          <>
            <div className={Classes.DIALOG_BODY}>
              Are you sure you want to delete the issue "{issue.description}"?
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button intent="danger" onClick={handleDeleteFeature} text="Delete Issue" />
              </div>
            </div>
          </>
        )}
      </Dialog>

      <Card>
        <div className="project-panel-card-heading">
          <H5>{issue.title}</H5>
          {issue.closed && (
            <Tag intent="success" minimal>
              closed
            </Tag>
          )}

          <div className="panel-card-buttons">
            <Button icon="chat" onClick={() => setOpen(true)} small text="Discussion" />
            {!overview && (
              <Button
                icon="edit"
                onClick={() => dispatch({ type: 'UPDATE_ISSUE' })}
                small
                text="Update Issue"
              />
            )}

            {roles.includes('ADMIN') && !overview && (
              <>
                <Button
                  icon="trash"
                  onClick={() => dispatch({ type: 'DELETE_ISSUE' })}
                  small
                  text="Delete Issue"
                />
                <Switch
                  checked={issue.closed}
                  innerLabel="closed"
                  innerLabelChecked="closed"
                  onChange={handleCloseIssue}
                />
              </>
            )}
          </div>
        </div>

        <div className={Classes.RUNNING_TEXT}>{issue.description}</div>
      </Card>
    </>
  )
}
