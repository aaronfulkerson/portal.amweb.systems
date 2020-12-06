import { useMutation, useParam, useRouter } from 'blitz'
import { Button } from '@blueprintjs/core'
import { Field, Form } from 'react-final-form'

import { AppToaster } from '@components/Toaster'
import { InputGroupAdapter } from '@components/FormAdapters'

import { TokenType } from '@prisma/client'
import { AmwebPage } from 'types'
import { CreatePassword, CreatePasswordType } from 'app/auth/validations'
import createPassword from 'app/auth/mutations/createPassword'

const CreatePasswordPage: AmwebPage = () => {
  const router = useRouter()
  const token = useParam('token', 'string') as string
  const type = useParam('type', 'string') as TokenType
  const [createPasswordMutation] = useMutation(createPassword)

  return (
    <>
      <Form<CreatePasswordType>
        onSubmit={async (values) => {
          try {
            await createPasswordMutation({ ...values, token, type })
            await router.push('/auth/login')
            AppToaster?.show({ intent: 'success', message: 'Password set.' })
          } catch ({ message }) {
            await router.push('/auth/login')
            AppToaster?.show({ intent: 'warning', message })
          }
        }}
        render={({ handleSubmit, pristine, submitting }) => (
          <div id="create-password">
            <div id="create-password-form">
              <h1>{type === 'RESET_PASSWORD' ? 'Reset Password' : 'Signup'}</h1>
              <form onSubmit={handleSubmit}>
                <Field
                  component={InputGroupAdapter}
                  disabled={submitting}
                  large
                  name="password"
                  password
                  placeholder="Password"
                />
                <Field
                  component={InputGroupAdapter}
                  disabled={submitting}
                  large
                  name="passwordConfirmation"
                  password
                  placeholder="Password Confirmation"
                />
                <Button
                  disabled={pristine || submitting}
                  fill
                  intent="primary"
                  large
                  text={type === 'RESET_PASSWORD' ? 'Set New Password' : 'Complete Signup'}
                  type="submit"
                />
              </form>
            </div>
          </div>
        )}
        validate={(values) => {
          try {
            CreatePassword.parse({ ...values, token, type })
          } catch (error) {
            return error.formErrors.fieldErrors
          }
        }}
      />
      <style jsx>{`
        #create-password {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
        }

        #create-password-form {
          width: 20rem;
        }
      `}</style>
    </>
  )
}

CreatePasswordPage.allowed = ['public']

export default CreatePasswordPage
