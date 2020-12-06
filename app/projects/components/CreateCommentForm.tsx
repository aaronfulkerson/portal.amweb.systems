import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'
import { Button, Classes } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { AppToaster } from '@components/Toaster'
import { TextAreaAdapter } from '@components/FormAdapters'

import { CreateComment, CreateCommentType } from '../validations'
import createComment from '../mutations/createComment'
import getComments from '../queries/getComments'

export const CreateCommentForm: FunctionComponent<{ featureId: number } | { issueId: number }> = (
  props
) => {
  const [createCommentMutation] = useMutation(createComment)

  return (
    <Form<CreateCommentType>
      onSubmit={async (values) => {
        try {
          await createCommentMutation(values)
          await invalidateQuery(getComments)
          AppToaster?.show({ intent: 'success', message: 'Submitted comment.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      render={({ form, handleSubmit, pristine, submitting }) => (
        <form
          onSubmit={(event) =>
            handleSubmit(event)?.then(() => {
              form.reset()
              form.resetFieldState('value')
            })
          }
        >
          <div className={Classes.DIALOG_BODY}>
            {'featureId' in props && (
              <Field component={() => <></>} initialValue={props.featureId} name="featureId" />
            )}
            {'issueId' in props && (
              <Field component={() => <></>} initialValue={props.issueId} name="issueId" />
            )}
            <Field
              component={TextAreaAdapter}
              disabled={submitting}
              fill
              large
              name="value"
              placeholder="Comment"
            />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                disabled={pristine || submitting}
                intent="primary"
                large
                text="Submit Comment"
                type="submit"
              />
            </div>
          </div>
        </form>
      )}
      validate={(values) => {
        try {
          CreateComment.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
