import { registerUserSchema } from '@domain/users/infra/http/validators/register-user.dto'
import { createZodValidator } from '@infra/utils/zod/create-validator'

export class UpdateUserDto extends createZodValidator(
  registerUserSchema
    .omit({
      password: true,
    })
    .partial(),
) {}
