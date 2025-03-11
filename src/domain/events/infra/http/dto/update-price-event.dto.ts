import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export class UpdatePriceEventDto extends createZodValidator(
  z.object({
    price: z.number().int().positive(),
  }),
) {}
