import { TicketStatusEnum } from '@domain/ticket/domain/ticket.status.enum'
import { z } from 'zod'

export type GetParticipantsResponseSchema = z.infer<typeof getParticipantsResponseSchema>

export const getParticipantsResponseSchema = z.object({
  participants: z.array(
    z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      tickets: z.array(
        z.object({
          id: z.string().uuid(),
          status: z.nativeEnum(TicketStatusEnum),
        }),
      ),
    }),
  ),
})
