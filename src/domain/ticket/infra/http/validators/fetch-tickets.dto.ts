import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export class FetchTicketsDto extends createZodValidator(
  z.object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .transform((vl) => vl - 1),
    limit: z.coerce.number().positive().default(10),
  }),
) {}
