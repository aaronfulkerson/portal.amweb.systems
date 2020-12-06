import Stripe from 'stripe'
import { Stripe as IStripe, loadStripe } from '@stripe/stripe-js'

const { STRIPE_PK, STRIPE_SK } = process.env

/**
 * NODE
 */
export const stripe = new Stripe(STRIPE_SK as string, { apiVersion: '2020-08-27' })

/**
 * REACT
 */
let stripePromise: Promise<IStripe | null>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PK!)
  }
  return stripePromise
}
