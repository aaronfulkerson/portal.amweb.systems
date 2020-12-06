import { FunctionComponent } from 'react'
import { invalidateQuery, useQuery } from 'blitz'
import { Classes, H5 } from '@blueprintjs/core'

import { CreateCommentForm } from './CreateCommentForm'

import { CommentWithUser } from '../types'
import getComments from '../queries/getComments'
import getNotifications from 'app/queries/getNotifications'

interface IComments {
  comments: CommentWithUser[]
}

const Comments: FunctionComponent<IComments> = ({ comments }) => {
  return (
    <>
      {comments
        .map((comment) => (
          <div>
            <H5>{comment.user.name}</H5>
            <p className="message">{comment.value}</p>
          </div>
        ))
        .reverse()}
    </>
  )
}

export const DiscussionThread: FunctionComponent<{ featureId: number } | { issueId: number }> = (
  props
) => {
  const [comments] = useQuery(getComments, props, {
    onSuccess: () => invalidateQuery(getNotifications),
  })

  return (
    <div className="discussion-thread">
      <div className={`${Classes.DIALOG_BODY} message-pane`}>
        <Comments comments={comments} />
      </div>
      <div className="comment-form">
        <CreateCommentForm {...props} />
      </div>
    </div>
  )
}
