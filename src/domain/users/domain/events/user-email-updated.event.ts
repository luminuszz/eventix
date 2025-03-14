import { DomainEvent } from '@domain/shared/domain.event'
import { UserEntity } from '@domain/users/domain/users.entity'

export class UserEmailUpdatedEvent extends DomainEvent {
  getEventName(): string {
    throw new Error('Method not implemented.')
  }

  constructor(public readonly user: UserEntity) {
    super()
  }
}
