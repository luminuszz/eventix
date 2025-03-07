import { DomainEvent } from '@domain/shared/domain.event'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'

export class TicketCreatedEvent extends DomainEvent {
  getEventName(): string {
    return this.constructor.name
  }
  constructor(public readonly ticket: TicketEntity) {
    super()
  }
}
