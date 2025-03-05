import { TicketEntity } from '@domain/ticket/domain/ticket.entity'

export class TicketCreatedEvent {
  constructor(public readonly ticket: TicketEntity) {}
}
