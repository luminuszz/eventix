import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  maxCapacity: z.number().int().positive().min(1),
})

export class CreateEventDto extends createZodValidator(schema) {}
