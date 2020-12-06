import { FunctionComponent, useEffect, useState } from 'react'
import { useMutation, useRouter, useSession } from 'blitz'

import { Loading } from '@components/Loading'
import { NotificationProvider } from '@components/NotificationProvider'

import { Role } from '@prisma/client'
import { AllowedRoles } from 'types'
import logout from '../mutations/logout'

export const AuthGuard: FunctionComponent<AllowedRoles> = ({ allowed, children }) => {
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()
  const { isLoading, roles, userId } = useSession()
  const [loading, setLoading] = useState(true)

  const authorized = roles.some((role: Role) => allowed?.includes(role))
  const publicPage = allowed?.includes('public') || !allowed

  useEffect(() => {
    if (!isLoading && !authorized && !publicPage) {
      logoutMutation().then(async () => {
        await router.push('/auth/login').then(() => setLoading(false))
      })
    }

    if (!isLoading && userId && publicPage) router.push('/')

    if ((!isLoading && authorized) || (!isLoading && !userId && publicPage)) setLoading(false)
  }, [authorized, isLoading, publicPage])

  return (
    <Loading loading={loading}>
      {userId ? <NotificationProvider>{children}</NotificationProvider> : <>{children}</>}
    </Loading>
  )
}
