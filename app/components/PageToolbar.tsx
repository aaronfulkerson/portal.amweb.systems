import { FunctionComponent } from 'react'
import { Navbar } from '@blueprintjs/core'

interface IPageToolbar {
  heading?: string
}

export const PageToolbar: FunctionComponent<IPageToolbar> = ({ children, heading }) => {
  return (
    <Navbar className="page-toolbar">
      <Navbar.Group>
        {heading && (
          <>
            <Navbar.Heading>{heading}</Navbar.Heading>
            <Navbar.Divider />
          </>
        )}
        {children}
      </Navbar.Group>
    </Navbar>
  )
}
