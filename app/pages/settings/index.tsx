import { invalidateQuery, useMutation, useQuery } from 'blitz'
import { H4, Switch } from '@blueprintjs/core'

import { Layout } from 'app/layouts/Layout'

import { AmwebPage } from 'types'
import getSettings from 'app/settings/queries/getSettings'
import { ChangeEvent } from 'react'
import updateSettings from 'app/settings/mutations/updateSettings'
import { AppToaster } from '@components/Toaster'

const Settings: AmwebPage = () => {
  const [user] = useQuery(getSettings, undefined)
  const [updateSettingsMutations] = useMutation(updateSettings)

  return (
    <>
      <div id="settings">
        <div id="settings-form">
          <H4>Settings</H4>
          <Switch
            checked={user?.settings?.emailNotifications}
            label="Email Notifications"
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              try {
                await updateSettingsMutations({ emailNotifications: e.target.checked })
                await invalidateQuery(getSettings)
              } catch ({ message }) {
                AppToaster?.show({ message })
              }
            }}
          />
        </div>
      </div>
      <style jsx>{`
        #settings {
          display: flex;
          height: 100%;
          justify-content: center;
        }

        #settings-form {
          margin-top: 5rem;
          width: 40rem;
        }
      `}</style>
    </>
  )
}

Settings.getLayout = (page) => <Layout title="Users">{page}</Layout>

Settings.allowed = ['ADMIN', 'BASIC_CLIENT', 'PRIVILEGED_CLIENT']

export default Settings
