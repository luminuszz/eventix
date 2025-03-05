import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export class CreateSessionDto extends createZodValidator(schema) {}
