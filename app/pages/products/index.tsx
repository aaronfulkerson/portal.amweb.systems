import { useState } from 'react'
import { useQuery } from 'blitz'
import { Button, Dialog } from '@blueprintjs/core'
import { AmwebPage } from 'types'

import { Layout } from 'app/layouts/Layout'
import { PageToolbar } from '@components/PageToolbar'
import { CreateProductForm } from 'app/products/components/CreateProductForm'
import { ProductsTable } from 'app/products/components/ProductsTable'

import getProducts from 'app/products/queries/getProducts'

const Products: AmwebPage = () => {
  const [open, setOpen] = useState(false)

  const [products] = useQuery(getProducts, undefined)

  return (
    <div className="amweb-page">
      <PageToolbar>
        <Button icon="plus" onClick={() => setOpen(true)} text="New Product" />
      </PageToolbar>

      <Dialog icon="barcode" isOpen={open} onClose={() => setOpen(false)} title="New Product">
        <CreateProductForm close={() => setOpen(false)} />
      </Dialog>

      <ProductsTable products={products} />
    </div>
  )
}

Products.getLayout = (page) => <Layout title="Products">{page}</Layout>

Products.allowed = ['ADMIN']

export default Products
