import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export const registerEventAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
  country: z.string(),
})

export class RegisterEventAddressDto extends createZodValidator(registerEventAddressSchema) {}
