import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export class CreateTicketDto extends createZodValidator(
  z.object({
    eventId: z.string().uuid(),
  }),
) {}
