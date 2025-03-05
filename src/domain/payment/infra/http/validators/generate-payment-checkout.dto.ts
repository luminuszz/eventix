import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export class GeneratePaymentCheckoutDto extends createZodValidator(
  z.object({
    ticketId: z.string().uuid(),
  }),
) {}
