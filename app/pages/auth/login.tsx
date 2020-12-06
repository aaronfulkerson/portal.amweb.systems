import { useEffect } from 'react'
import { useRouter } from 'blitz'
import { AmwebPage } from 'types'
import { LoginForm } from 'app/auth/components/LoginForm'

const Login: AmwebPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/')
  }, [router])

  return <LoginForm onSuccess={() => router.push('/')} />
}

Login.allowed = ['public']

export default Login
