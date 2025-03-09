import { DomainEvent } from '@domain/shared/domain.event'
import { UserEntity } from '@domain/users/domain/users.entity'

export class UserCreatedEvent extends DomainEvent {
  getEventName(): string {
    return this.constructor.name
  }
  constructor(public readonly user: UserEntity) {
    super()
  }
}
