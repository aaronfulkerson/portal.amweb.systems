import { FunctionComponent, useState } from 'react'
import { Button, Dialog, H6 } from '@blueprintjs/core'

import { Company } from '@prisma/client'
import { UpdateCompanyForm } from './UpdateCompanyForm'

const CompanyRow: FunctionComponent<{ company: Company }> = ({ company }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Dialog icon="office" isOpen={open} onClose={() => setOpen(false)} title="Update Company">
        <UpdateCompanyForm close={() => setOpen(false)} company={company} />
      </Dialog>

      <div className="left-border actions">
        <Button icon="edit" onClick={() => setOpen(true)} small />
      </div>
      <div>{company.name}</div>
      <div className="right-border">{company.email}</div>
    </>
  )
}

export const CompaniesTable: FunctionComponent<{ companies: Company[] }> = ({ companies }) => {
  return (
    <>
      {!!companies.length && (
        <div className="data-grid companies-grid">
          <H6>Actions</H6>
          <H6>Name</H6>
          <H6>Email</H6>
          {companies.map((company, i) => (
            <CompanyRow company={company} key={i} />
          ))}
        </div>
      )}
    </>
  )
}
