import { TicketStatusEnum } from '@domain/ticket/domain/ticket.status.enum'
import { z } from 'zod'

const ticketStatusMapper: Record<TicketStatusEnum, string> = {
  [TicketStatusEnum.CHECKED_IN]: 'checked-in',
  [TicketStatusEnum.PENDING]: 'pending',
  [TicketStatusEnum.CANCELED]: 'canceled',
  [TicketStatusEnum.CONFIRMED]: 'confirmed',
}

export const paginatedTicketSchema = z.object({
  page: z
    .number()
    .int()
    .transform((vl) => vl + 1),
  totalOfPages: z.number().int(),
  tickets: z.array(
    z.object({
      id: z.string(),
      status: z.nativeEnum(TicketStatusEnum).transform((vl) => ticketStatusMapper[vl]),
      createdAt: z.date(),
      event: z.object({
        name: z.string(),
        description: z.string(),
      }),
    }),
  ),
})
