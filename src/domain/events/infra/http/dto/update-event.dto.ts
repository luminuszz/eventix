import {createEventSchema} from '@domain/events/infra/http/dto/create-event.dto'
import {createZodValidator} from '@infra/utils/zod/create-validator'

export class UpdateEventDto extends createZodValidator(
  createEventSchema.pick({
    name: true,
    description: true,
    maxCapacity: true,
  }),
) {}
