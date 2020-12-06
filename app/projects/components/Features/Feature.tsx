import { ChangeEvent, FunctionComponent, useReducer, useState } from 'react'
import { invalidateQuery, useMutation, useSession } from 'blitz'
import {
  Button,
  Card,
  Classes,
  Dialog,
  Drawer,
  H5,
  H6,
  IconName,
  ProgressBar,
  Switch,
  Tag,
} from '@blueprintjs/core'

import { AppToaster } from '@components/Toaster'
import { DiscussionThread } from '../DiscussionThread'
import { FeatureDetailRow } from './FeatureDetailRow'
import { UpdateFeatureForm } from './UpdateFeatureForm'
import { CreateFeatureDetailForm } from './CreateFeatureDetailForm'

import { FeatureWithFeatureDetails } from '../../types'
import updateFeature from 'app/projects/mutations/updateFeature'
import deleteFeature from 'app/projects/mutations/deleteFeature'
import getFeatures from 'app/projects/queries/getFeatures'

const initialState = { action: undefined, icon: undefined, open: false, title: undefined }

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_DETAIL':
      return { action: action.type, icon: 'plus', open: true, title: 'Create Detail' }
    case 'UPDATE_FEATURE':
      return { action: action.type, icon: 'edit', open: true, title: 'Update Feature' }
    case 'DELETE_FEATURE':
      return { action: action.type, icon: 'trash', open: true, title: 'Delete Feature' }
    case 'CLOSE':
      return initialState
  }
}

export const Feature: FunctionComponent<{
  feature: FeatureWithFeatureDetails
  overview?: boolean
}> = ({ feature, overview }) => {
  const { roles } = useSession()
  const [updateFeatureMutation] = useMutation(updateFeature)
  const [deleteFeatureMutation] = useMutation(deleteFeature)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [open, setOpen] = useState(false)

  const pctComplete = !!feature.featureDetails.length
    ? feature.featureDetails.reduce((acc, { complete }) => (complete ? acc + 1.0 : acc), 0.0) /
      feature.featureDetails.length
    : 0
  const intent = pctComplete === 1 ? 'success' : 'none'
  const hasCompleted = feature.featureDetails.some(({ complete }) => complete)

  const handleArchiveFeature = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      await updateFeatureMutation({ complete: e.target.checked, id: feature.id })
      await invalidateQuery(getFeatures)
      dispatch({ type: 'CLOSE' })
      AppToaster?.show({ intent: 'success', message: 'Feature complete.' })
    } catch ({ message }) {
      AppToaster?.show({ intent: 'warning', message })
    }
  }

  const handleDeleteFeature = async () => {
    try {
      await deleteFeatureMutation({ id: feature.id })
      await invalidateQuery(getFeatures)
      dispatch({ type: 'CLOSE' })
      AppToaster?.show({ intent: 'success', message: 'Feature deleted.' })
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
        title={`Discusson: ${feature.description}`}
      >
        <DiscussionThread featureId={feature.id} />
      </Drawer>

      <Dialog
        icon={state?.icon as IconName}
        isOpen={state?.open}
        onClose={() => dispatch({ type: 'CLOSE' })}
        title={state?.title}
      >
        {state?.action === 'CREATE_DETAIL' && (
          <CreateFeatureDetailForm
            close={() => dispatch({ type: 'CLOSE' })}
            featureDetail={{
              featureId: feature.id,
              description: '',
            }}
          />
        )}

        {state?.action === 'UPDATE_FEATURE' && (
          <UpdateFeatureForm close={() => dispatch({ type: 'CLOSE' })} feature={feature} />
        )}

        {state?.action === 'DELETE_FEATURE' && (
          <>
            <div className={Classes.DIALOG_BODY}>
              Are you sure you want to delete the feature "{feature.description}"?
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button intent="danger" onClick={handleDeleteFeature} text="Delete Feature" />
              </div>
            </div>
          </>
        )}
      </Dialog>

      <Card>
        <div className="project-panel-card-heading">
          <H5>{feature.title}</H5>

          <Tag intent={intent} minimal>
            {pctComplete === 1 ? 'complete' : 'in progress'}
          </Tag>

          <div className="panel-card-buttons">
            <Button icon="chat" onClick={() => setOpen(true)} small text="Discussion" />

            {roles.includes('ADMIN') && !overview && (
              <>
                <Button
                  icon="plus"
                  onClick={() => dispatch({ type: 'CREATE_DETAIL' })}
                  small
                  text="Create Detail"
                />
                <Button
                  icon="edit"
                  onClick={() => dispatch({ type: 'UPDATE_FEATURE' })}
                  small
                  text="Update Feature"
                />
                <Button
                  disabled={hasCompleted}
                  icon="trash"
                  onClick={() => dispatch({ type: 'DELETE_FEATURE' })}
                  small
                  text="Delete Feature"
                />
                <Switch
                  checked={feature.complete}
                  disabled={pctComplete < 1}
                  innerLabel="complete"
                  innerLabelChecked="complete"
                  onChange={handleArchiveFeature}
                />
              </>
            )}
          </div>
        </div>

        <div className={Classes.RUNNING_TEXT}>{feature.description}</div>

        <ProgressBar animate={false} intent="primary" stripes={false} value={pctComplete} />

        {!!feature.featureDetails.length && (
          <div
            className={`data-grid feature-details-grid ${
              !!roles.includes('ADMIN') && !overview && 'admin'
            }`}
          >
            {!!roles.includes('ADMIN') && !overview && <H6>Actions</H6>}
            <H6>Complete</H6>
            <H6>Description</H6>
            {feature.featureDetails.map((featureDetail, i) => (
              <FeatureDetailRow
                featureDetail={featureDetail}
                key={i}
                overview={overview}
                projectId={feature.projectId}
              />
            ))}
          </div>
        )}
      </Card>
    </>
  )
}
