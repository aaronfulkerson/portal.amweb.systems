import { FunctionComponent, Suspense } from 'react'
import { ErrorComponent, useRouter } from 'blitz'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { queryCache } from 'react-query'

import '@styles/main.scss'

import { AuthGuard } from 'app/auth/components/AuthGuard'
import { LoginForm } from 'app/auth/components/LoginForm'
import { Loading } from '@components/Loading'

import { AmwebAppProps } from 'types'

const App: FunctionComponent<AmwebAppProps> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
    >
      <Suspense fallback={<Loading loading />}>
        <AuthGuard allowed={Component.allowed}>{getLayout(<Component {...pageProps} />)}</AuthGuard>
      </Suspense>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error?.name === 'AuthenticationError') {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error?.name === 'AuthorizationError') {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name}
      />
    )
  }
}

export default App
