import { DefaultCtx, SessionContext, DefaultPublicData, BlitzComponentType, BlitzPage } from 'blitz'
import { NextPageContext } from 'next'
import { AppProps as NextAppProps } from 'next/app'
import { Prisma, Role, User } from '@prisma/client'

declare module 'blitz' {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface PublicData extends DefaultPublicData {
    userId: User['id']
  }
}

export interface AllowedRoles {
  allowed?: (Role | 'public')[]
}
export declare type AmwebPage = BlitzPage & AllowedRoles
export declare interface AmwebAppProps<P = {}> extends NextAppProps<P> {
  Component: BlitzComponentType<NextPageContext, any, P> & {
    getLayout?: (component: JSX.Element) => JSX.Element
  } & AllowedRoles
}

export type AmwebNotification = Prisma.NotificationGetPayload<{
  include: {
    commentNotifications: { include: { comment: { include: { feature: true; issue: true } } } }
    invoiceNotifications: { include: { invoice: true } }
    issueNotifications: { include: { issue: true } }
  }
}>
