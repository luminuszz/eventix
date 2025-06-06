import { createZodValidator } from '@infra/utils/zod/create-validator'
import { z } from 'zod'

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
})

export class RegisterUserDto extends createZodValidator(registerUserSchema) {}
