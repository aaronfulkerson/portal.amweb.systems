import { FunctionComponent, useEffect } from 'react'
import { Link, useMutation, useRouter, useSession } from 'blitz'
import { NextRouter } from 'next/router'
import {
  Alignment,
  Button,
  Classes,
  Menu,
  MenuDivider,
  MenuItem,
  Navbar,
  Popover,
  PopoverPosition,
} from '@blueprintjs/core'

import { NotificationConsumer } from './NotificationProvider'

import { AmwebNotification } from 'types'
import logout from 'app/auth/mutations/logout'

const UserMenu: FunctionComponent<{ router: NextRouter }> = ({ router }) => {
  const [logoutMutation] = useMutation(logout)

  const handleLogout = async () => {
    await logoutMutation()
    await router.push('/auth/login')
  }

  return (
    <Menu>
      <Link href="/settings">
        <MenuItem text="Settings" />
      </Link>
      <MenuDivider />
      <MenuItem onClick={handleLogout} text="Log out" />
    </Menu>
  )
}

const getNotification = (notification: AmwebNotification): { href: string; text: string } => {
  switch (notification.type) {
    case 'COMMENT': {
      const {
        commentNotifications: [
          {
            comment: { feature, issue },
          },
        ],
      } = notification
      const [{ projectId, title }] = feature.length ? feature : issue
      return feature.length
        ? {
            href: `/projects/${projectId}`,
            text: `Comment on ${title}`,
          }
        : {
            href: `/projects/${projectId}`,
            text: `Comment on ${title}`,
          }
    }
    case 'INVOICE': {
      const {
        invoiceNotifications: [{ invoiceId }],
      } = notification
      return { href: `/invoices/${invoiceId}`, text: `New Invoice` }
    }
    case 'ISSUE': {
      const {
        issueNotifications: [
          {
            issue: { id, title },
          },
        ],
      } = notification
      return { href: `/issues/${id}`, text: `New Issue ${title}` }
    }
  }
}

const NotificationMenu: FunctionComponent<{ notifications: AmwebNotification[] }> = ({
  notifications,
}) => {
  return (
    <Menu>
      {notifications.map((notification) => {
        const { href, text } = getNotification(notification)
        return (
          <Link href={href}>
            <MenuItem text={text} />
          </Link>
        )
      })}
    </Menu>
  )
}

export const Header: FunctionComponent = () => {
  const router = useRouter()
  const { roles } = useSession()

  useEffect(() => {
    router.prefetch('/auth/login')
  }, [router])

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Link href="/">
          <Button className={Classes.MINIMAL} icon="dashboard" large text="Dashboard" />
        </Link>
        <Link href="/projects">
          <Button className={Classes.MINIMAL} icon="build" large text="Projects" />
        </Link>
        <Link href="/invoices">
          <Button className={Classes.MINIMAL} icon="dollar" large text="Invoices" />
        </Link>
        {roles.includes('ADMIN') && (
          <>
            <Link href="/products">
              <Button className={Classes.MINIMAL} icon="barcode" large text="Products" />
            </Link>
            <Link href="/companies">
              <Button className={Classes.MINIMAL} icon="office" large text="Companies" />
            </Link>
            <Link href="/users">
              <Button className={Classes.MINIMAL} icon="user" large text="Users" />
            </Link>
          </>
        )}
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <NotificationConsumer>
          {(notifications = []) => (
            <Popover position={PopoverPosition.BOTTOM_RIGHT}>
              <Button
                className={Classes.MINIMAL}
                icon="notifications"
                text={notifications.length}
              />
              {!!notifications.length && <NotificationMenu notifications={notifications} />}
            </Popover>
          )}
        </NotificationConsumer>
        <Popover position={PopoverPosition.BOTTOM_RIGHT}>
          <Button className={Classes.MINIMAL} icon="user" />
          <UserMenu router={router} />
        </Popover>
      </Navbar.Group>
    </Navbar>
  )
}
