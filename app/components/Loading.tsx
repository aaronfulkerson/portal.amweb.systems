import { Spinner } from '@blueprintjs/core'
import { FunctionComponent, ReactNode } from 'react'

interface ILoading {
  children?: ReactNode
  loading: boolean
}

export const Loading: FunctionComponent<ILoading> = ({ children, loading }) => {
  return loading ? (
    <>
      <div id="loading">
        <Spinner />
      </div>
      <style jsx>{`
        #loading {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
        }
      `}</style>
    </>
  ) : (
    <>{children}</>
  )
}
