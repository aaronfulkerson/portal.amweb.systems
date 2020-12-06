import { ChangeEvent, FunctionComponent, useReducer } from 'react'
import { invalidateQuery, useMutation, useSession } from 'blitz'
import { Button, Checkbox, Classes, Dialog, IconName } from '@blueprintjs/core'

import { AppToaster } from '@components/Toaster'
import { UpdateFeatureDetailForm } from './UpdateFeatureDetailForm'

import { FeatureDetail } from '@prisma/client'
import updateFeatureDetail from 'app/projects/mutations/updateFeatureDetail'
import deleteFeatureDetail from 'app/projects/mutations/deleteFeatureDetail'
import getFeatures from 'app/projects/queries/getFeatures'

interface IFeatureDetailRow {
  featureDetail: FeatureDetail
  overview?: boolean
  projectId: number
}

const initialState = { action: undefined, icon: undefined, open: false, title: undefined }

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DETAIL':
      return { action: action.type, icon: 'edit', open: true, title: 'Update Detail' }
    case 'DELETE_DETAIL':
      return { action: action.type, icon: 'trash', open: true, title: 'Delete Detail' }
    case 'CLOSE':
      return initialState
  }
}

export const FeatureDetailRow: FunctionComponent<IFeatureDetailRow> = ({
  featureDetail,
  overview,
  projectId,
}) => {
  const { roles } = useSession()
  const [updateFeatureDetailMutation] = useMutation(updateFeatureDetail)
  const [deleteFeatureDetailMutation] = useMutation(deleteFeatureDetail)
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleUpdateFeatureDetail = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      await updateFeatureDetailMutation({
        id: featureDetail.id,
        featureId: featureDetail.featureId,
        complete: e.target.checked,
      })
      await invalidateQuery(getFeatures)
      AppToaster?.show({ intent: 'success', message: 'Updated detail.' })
    } catch ({ message }) {
      AppToaster?.show({ intent: 'warning', message })
    }
  }

  const handleDeleteFeatureDetail = async () => {
    try {
      await deleteFeatureDetailMutation({ id: featureDetail.id })
      await invalidateQuery(getFeatures)
      dispatch({ type: 'CLOSE' })
      AppToaster?.show({ intent: 'success', message: 'Feature detail deleted.' })
    } catch ({ message }) {
      AppToaster?.show({ intent: 'warning', message })
    }
  }

  return (
    <>
      <Dialog
        icon={state?.icon as IconName}
        isOpen={state?.open}
        onClose={() => dispatch({ type: 'CLOSE' })}
        title={state?.title}
      >
        {state?.action === 'UPDATE_DETAIL' && (
          <UpdateFeatureDetailForm
            close={() => dispatch({ type: 'CLOSE' })}
            featureDetail={{ ...featureDetail, projectId }}
          />
        )}

        {state?.action === 'DELETE_DETAIL' && (
          <>
            <div className={Classes.DIALOG_BODY}>
              Are you sure you want to delete the feature detail "{featureDetail.description}"?
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button intent="danger" onClick={handleDeleteFeatureDetail} text="Delete Detail" />
              </div>
            </div>
          </>
        )}
      </Dialog>

      {!!roles.includes('ADMIN') && !overview && (
        <div className="left-border actions">
          <Button
            disabled={!roles.includes('ADMIN')}
            icon="edit"
            onClick={() => dispatch({ type: 'UPDATE_DETAIL' })}
            small
          />
          <Button
            disabled={featureDetail.complete || !roles.includes('ADMIN')}
            icon="trash"
            onClick={() => dispatch({ type: 'DELETE_DETAIL' })}
            small
          />
        </div>
      )}
      <div className={`complete ${(!roles.includes('ADMIN') || overview) && 'left-border'}`}>
        <Checkbox
          checked={featureDetail.complete}
          disabled={!roles.includes('ADMIN') || overview}
          large
          onChange={handleUpdateFeatureDetail}
        />
      </div>
      <div className="right-border">{featureDetail.description}</div>
    </>
  )
}
