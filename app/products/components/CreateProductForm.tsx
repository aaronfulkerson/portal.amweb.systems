import { FunctionComponent } from 'react'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { ProductForm } from './ProductForm'

import { CreateProduct } from '../validations'
import createProduct from '../mutations/createProduct'
import getProducts from 'app/products/queries/getProducts'

export const CreateProductForm: FunctionComponent<{ close: () => void }> = ({ close }) => {
  const [createProductMutation] = useMutation(createProduct)

  return (
    <ProductForm
      onSubmit={async (values) => {
        try {
          await createProductMutation(values)
          await invalidateQuery(getProducts)
          close()
          AppToaster?.show({ intent: 'success', message: 'Created product.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      validate={(values) => {
        try {
          CreateProduct.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
