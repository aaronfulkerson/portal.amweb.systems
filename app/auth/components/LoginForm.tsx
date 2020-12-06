import React, { FunctionComponent } from 'react'
import { Link, useMutation } from 'blitz'
import { Button } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { AppToaster } from '@components/Toaster'
import { InputGroupAdapter } from '@components/FormAdapters'

import { Login, LoginType } from 'app/auth/validations'
import login from 'app/auth/mutations/login'

interface ILoginForm {
  onSuccess?: () => void
}

export const LoginForm: FunctionComponent<ILoginForm> = ({ onSuccess }) => {
  const [loginMutation] = useMutation(login)
  return (
    <>
      <Form<LoginType>
        onSubmit={async ({ email, password }) => {
          try {
            await loginMutation({ email, password })
            onSuccess && onSuccess()
          } catch (error) {
            const message =
              error.name === 'AuthenticationError' ? 'Incorrect username/password.' : error.message
            AppToaster?.show({ intent: 'warning', message })
          }
        }}
        render={({ handleSubmit, pristine, submitting }) => (
          <div id="login">
            <div id="login-form">
              <h1>Log in</h1>
              <form onSubmit={handleSubmit}>
                <Field
                  component={InputGroupAdapter}
                  disabled={submitting}
                  large
                  name="email"
                  placeholder="Email"
                />
                <Field
                  component={InputGroupAdapter}
                  disabled={submitting}
                  large
                  name="password"
                  password
                  placeholder="Password"
                />
                <Button
                  disabled={pristine || submitting}
                  id="login-button"
                  fill
                  intent="primary"
                  large
                  text="Log in"
                  type="submit"
                />
                <Link href="/auth/forgot">Forgot Password</Link>
              </form>
            </div>
          </div>
        )}
        validate={(values) => {
          try {
            Login.parse(values)
          } catch (error) {
            return error.formErrors.fieldErrors
          }
        }}
      />
      <style jsx>{`
        #login {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
        }

        #login-form {
          width: 20rem;
        }
      `}</style>
    </>
  )
}
