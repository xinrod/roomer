import Stripe from 'stripe';
import { formatAmountForStripe } from '../../../utils/stripe/stripe-helpers';
import {CURRENCY, MIN_AMOUNT, MAX_AMOUNT, AMOUNT_STEP} from '../../../utils/stripe/config';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, { apiVersion: null });

export default async function handler(req, res ) {
  if (req.method === 'POST') {
    const amount: number = req.body.amount
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
        throw new Error('Invalid amount.')
      }
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'donate',
        payment_method_types: ['card'],
        line_items: [
          {
            name: 'Custom amount donation',
            amount: formatAmountForStripe(amount, CURRENCY),
            currency: CURRENCY,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/result/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/donate`,
      }
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params
      )

      res.status(200).json(checkoutSession)
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}