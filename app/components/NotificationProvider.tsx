import { createContext, FunctionComponent } from 'react'
import { useQuery } from 'blitz'

import getNotifications from 'app/queries/getNotifications'

const { Consumer, Provider } = createContext(undefined as any)

const NotificationProvider: FunctionComponent = ({ children }) => {
  const [notifications] = useQuery(getNotifications, undefined, {
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  })

  return <Provider value={notifications}>{children}</Provider>
}

export { Consumer as NotificationConsumer, NotificationProvider }
