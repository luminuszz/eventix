import {EventTypeEnum} from '@domain/events/domain/entities/event-type.enum'
import {createZodValidator} from '@infra/utils/zod/create-validator'
import {z} from 'zod'

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  maxCapacity: z.number().int().positive().min(1),
  type: z.nativeEnum(EventTypeEnum),
  price: z.number().positive().default(0),
})

export class CreateEventDto extends createZodValidator(schema) {}
