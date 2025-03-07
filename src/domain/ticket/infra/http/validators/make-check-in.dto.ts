import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export class MakeCheckInDto extends createZodValidator(
  z.object({
    ticketId: z.string(),
  }),
) {}
