import { TicketEntity } from '@domain/ticket/domain/ticket.entity'

export class TicketApprovedEvent {
  constructor(public readonly ticket: TicketEntity) {}
}
