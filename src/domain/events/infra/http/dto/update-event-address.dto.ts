import { registerEventAddressSchema } from '@domain/events/infra/http/dto/register-event-address.dto'
import { createZodValidator } from '@infra/utils/zod/create-validator'

export class UpdateEventAddressDto extends createZodValidator(registerEventAddressSchema) {}
