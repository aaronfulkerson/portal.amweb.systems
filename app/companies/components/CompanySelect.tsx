import { FunctionComponent, Dispatch, SetStateAction, useState } from 'react'
import { useQuery } from 'blitz'
import { Button, ButtonGroup, Dialog, MenuItem } from '@blueprintjs/core'
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select'

import { CreateCompanyForm } from 'app/companies/components/CreateCompanyForm'

import { Company } from '@prisma/client'
import getCompanies from 'app/companies/queries/getCompanies'

interface ICompanySelect {
  onSelect: Dispatch<SetStateAction<Company | undefined>>
  value?: Company
}

const BPCompanySelect = Select.ofType<Company>()

const renderCompany: ItemRenderer<Company> = (company, { handleClick }) => {
  return <MenuItem key={company.id} onClick={handleClick} text={company.name} />
}

const filterCompany: ItemPredicate<Company> = (query, company, __index, exactMatch) => {
  const normalizedName = company.name.toLowerCase()
  const normalizedQuery = query.toLowerCase()
  return exactMatch
    ? normalizedName === normalizedQuery
    : normalizedName.indexOf(normalizedQuery) >= 0
}

export const CompanySelect: FunctionComponent<ICompanySelect> = ({ onSelect, value }) => {
  const [open, setOpen] = useState(false)
  const [{ companies }] = useQuery(getCompanies, {})

  return (
    <>
      <Dialog icon="office" isOpen={open} onClose={() => setOpen(false)} title="New Company">
        <CreateCompanyForm close={() => setOpen(false)} />
      </Dialog>
      <ButtonGroup>
        <Button icon="plus" onClick={() => setOpen(true)} />
        <BPCompanySelect
          itemPredicate={filterCompany}
          itemRenderer={renderCompany}
          items={companies}
          onItemSelect={onSelect}
          noResults={<MenuItem disabled={true} text="No results." />}
          resetOnClose
          resetOnSelect
        >
          <Button
            id="company-select-button"
            rightIcon="double-caret-vertical"
            text={value?.name || 'Company Select'}
          />
        </BPCompanySelect>
        <Button icon="reset" id="company-reset" onClick={() => onSelect(undefined)} />
      </ButtonGroup>
      <style jsx>{`
        :global(#company-reset) {
          margin-right: 1rem;
        }

        :global(#company-select-button) {
          justify-content: space-between;
          min-width: 15rem;
        }
      `}</style>
    </>
  )
}
