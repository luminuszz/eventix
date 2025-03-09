import {EventEntity} from '@domain/events/domain/entities/event.entity'
import {DomainEvent} from '@domain/shared/domain.event'

export class EventCreated extends DomainEvent {
  getEventName(): string {
    return this.constructor.name
  }
  constructor(public readonly event: EventEntity) {
    super()
  }
}
