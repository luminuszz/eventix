import { EventAddressEntity } from '@domain/events/domain/entities/event-address.entity'
import { DomainEvent } from '@domain/shared/domain.event'

export class EventAddressUpdatedEvent extends DomainEvent {
  getEventName(): string {
    return this.constructor.name
  }

  constructor(public readonly address: EventAddressEntity) {
    super()
  }
}
