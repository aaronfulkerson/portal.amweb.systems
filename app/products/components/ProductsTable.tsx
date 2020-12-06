import { FunctionComponent, useReducer } from 'react'
import { invalidateQuery, useMutation, useRouter } from 'blitz'
import { Button, Classes, Dialog, H6, IconName } from '@blueprintjs/core'
import Stripe from 'stripe'

import { UpdateProductForm } from './UpdateProductForm'
import { AppToaster } from '@components/Toaster'

import deleteProduct from '../mutations/deleteProduct'
import getProducts from 'app/products/queries/getProducts'

const initialState = { action: undefined, icon: undefined, open: false, title: undefined }
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PRODUCT':
      return { action: action.type, icon: 'edit', open: true, title: 'Update Product' }
    case 'DELETE_PRODUCT':
      return { action: action.type, icon: 'trash', open: true, title: 'Delete Product' }
    case 'CLOSE':
      return initialState
  }
}

const ProductRow: FunctionComponent<{ product: Stripe.Product }> = ({ product }) => {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)

  const [deleteProductMutation] = useMutation(deleteProduct)
  const handleDeleteProductMutation = async (productId) => {
    try {
      await deleteProductMutation({ id: productId })
      await invalidateQuery(getProducts)
      dispatch({ type: 'CLOSE' })
      AppToaster?.show({ intent: 'success', message: 'Product deleted.' })
    } catch ({ message }) {
      AppToaster?.show({ intent: 'warning', message })
    }
  }

  return (
    <>
      <Dialog
        icon={state?.icon as IconName}
        isOpen={state?.open}
        onClose={() => dispatch({ type: 'CLOSE' })}
        title={state?.title}
      >
        {state?.action === 'UPDATE_PRODUCT' && (
          <UpdateProductForm close={() => dispatch({ type: 'CLOSE' })} product={product} />
        )}

        {state?.action === 'DELETE_PRODUCT' && (
          <>
            <div className={Classes.DIALOG_BODY}>
              Are you sure you want to delete the product {product.name}?
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  intent="danger"
                  onClick={() => handleDeleteProductMutation(product.id)}
                  text="Delete Product"
                />
              </div>
            </div>
          </>
        )}
      </Dialog>

      <div className="left-border actions">
        <Button icon="edit" onClick={() => dispatch({ type: 'UPDATE_PRODUCT' })} small />
        <Button icon="trash" onClick={() => dispatch({ type: 'DELETE_PRODUCT' })} small />
        <Button
          icon="document-open"
          onClick={async () => await router.push(`/products/${product.id}`)}
          small
        />
      </div>
      <div>{product.name}</div>
      <div className="right-border">{product.metadata.type}</div>
    </>
  )
}

export const ProductsTable: FunctionComponent<{
  products: Stripe.Response<Stripe.ApiList<Stripe.Product>>
}> = ({ products: { data } }) => {
  return (
    <>
      {!!data.length && (
        <div className="data-grid products-grid">
          <H6>Actions</H6>
          <H6>Name</H6>
          <H6>Type</H6>
          {data.map((product, i) => (
            <ProductRow key={i} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
