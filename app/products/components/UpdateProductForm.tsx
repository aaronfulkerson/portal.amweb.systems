import { FunctionComponent } from 'react'
import Stripe from 'stripe'
import { invalidateQuery, useMutation } from 'blitz'

import { AppToaster } from '@components/Toaster'
import { ProductForm } from './ProductForm'

import { UpdateProduct } from '../validations'
import updateProduct from '../mutations/updateProduct'
import getProducts from 'app/products/queries/getProducts'

interface IUpdateProductForm {
  close: () => void
  product?: Stripe.Product
}

export const UpdateProductForm: FunctionComponent<IUpdateProductForm> = ({ close, product }) => {
  const [updateProductMutation] = useMutation(updateProduct)

  return (
    <ProductForm
      onSubmit={async (values) => {
        try {
          await updateProductMutation(values)
          await invalidateQuery(getProducts)
          close()
          AppToaster?.show({ intent: 'success', message: 'Updated product.' })
        } catch ({ message }) {
          AppToaster?.show({ intent: 'warning', message })
        }
      }}
      product={product}
      validate={(values) => {
        try {
          UpdateProduct.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
    />
  )
}
