import { DomainEntity } from '@domain/shared/domain.entity'
import { UserEmailUpdatedEvent } from '@domain/users/domain/events/user-email-updated.event'
import { Column, Entity, Index } from 'typeorm'

@Entity('users')
export class UserEntity extends DomainEntity {
  @Column({ unique: true, nullable: false })
  @Index()
  email: string

  @Column({ nullable: false })
  passwordHash: string

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string

  changeEmail(email: string) {
    this.email = email
    this.apply(new UserEmailUpdatedEvent(this))
  }
}
