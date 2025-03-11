import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { DomainEvent } from '@domain/shared/domain.event'

export class EventUpdated extends DomainEvent {
  constructor(public readonly event: EventEntity) {
    super()
  }

  getEventName(): string {
    return this.constructor.name
  }
}
