import { DomainEvent } from '@domain/shared/domain.event'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'

export class TicketApprovedEvent extends DomainEvent {
  constructor(public readonly ticket: TicketEntity) {
    super()
  }

  getEventName(): string {
    return this.constructor.name
  }
}
