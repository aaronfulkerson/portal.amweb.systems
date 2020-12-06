import { FunctionComponent, ReactElement } from 'react'
import { Head } from 'blitz'

import { Header } from '../components/Header'

interface ILayout {
  title?: string
  children: ReactElement
}

export const Layout: FunctionComponent<ILayout> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || 'AMWEB'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {children}
    </>
  )
}
