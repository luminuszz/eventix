import { EventTypeEnum } from '@domain/events/domain/entities/event-type.enum'
import { z } from 'zod'

export const createEventSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  maxCapacity: z.number().int().positive().min(1),
  type: z.nativeEnum(EventTypeEnum),
  price: z.number().positive().optional(),
})

export const createEventSchemaByEventType = z.discriminatedUnion('type', [
  createEventSchema.extend({
    type: z.literal(EventTypeEnum.PAID),
    price: z.number().min(1).positive().int(),
  }),
  createEventSchema.extend({
    type: z.literal(EventTypeEnum.FREE),
    price: z.never(),
  }),
])
