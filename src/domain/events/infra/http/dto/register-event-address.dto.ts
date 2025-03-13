import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export class RegisterEventAddressDto extends createZodValidator(
  z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
) {}
