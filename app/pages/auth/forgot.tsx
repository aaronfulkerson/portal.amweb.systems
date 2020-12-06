import { useMutation, useRouter } from 'blitz'
import { Button } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { AppToaster } from '@components/Toaster'
import { InputGroupAdapter } from '@components/FormAdapters'

import { AmwebPage } from 'types'
import { ForgotPassword, ForgotPasswordType } from 'app/auth/validations'
import forgotPassword from 'app/auth/mutations/forgotPassword'

const ForgotPasswordPage: AmwebPage = () => {
  const router = useRouter()
  const [forgotPasswordMutation] = useMutation(forgotPassword)

  return (
    <>
      <Form<ForgotPasswordType>
        onSubmit={async ({ email }) => {
          try {
            await forgotPasswordMutation({ email })
            await router.push('/auth/login')
            AppToaster?.show({ intent: 'success', message: 'Email sent.' })
          } catch ({ message }) {
            await router.push('/auth/login')
            AppToaster?.show({ intent: 'warning', message })
          }
        }}
        render={({ handleSubmit, pristine, submitting }) => (
          <div id="forgot-password">
            <div id="forgot-password-form">
              <h1>Forgot Password</h1>
              <form onSubmit={handleSubmit}>
                <Field
                  component={InputGroupAdapter}
                  disabled={submitting}
                  large
                  name="email"
                  placeholder="Email"
                />
                <Button
                  disabled={pristine || submitting}
                  id="reset-button"
                  fill
                  intent="primary"
                  large
                  text="Send Reset Email"
                  type="submit"
                />
              </form>
            </div>
          </div>
        )}
        validate={(values) => {
          try {
            ForgotPassword.parse(values)
          } catch (error) {
            return error.formErrors.fieldErrors
          }
        }}
      />
      <style jsx>{`
        #forgot-password {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
        }

        #forgot-password-form {
          width: 20rem;
        }
      `}</style>
    </>
  )
}

ForgotPasswordPage.allowed = ['public']

export default ForgotPasswordPage
