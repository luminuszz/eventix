import { z } from 'zod'

export const parseStripeCheckoutSessionSchema = z.object({
  client_reference_id: z.string().nonempty(),
  status: z.enum(['complete', 'expired', 'open']),
})

export const parseStripeSubscriptionSchema = z.object({
  id: z.string().nonempty(),
  customer: z.string().nonempty(),
  status: z.enum([
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'trialing',
    'unpaid',
  ]),
})
