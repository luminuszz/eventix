import { EventEntity } from '@domain/events/entities/event.entity'
import { DomainEntity } from '@domain/shared/domain.entity'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity('tickets')
export class TicketEntity extends DomainEntity {
  @Column({ nullable: false })
  userId: string

  @Column({ nullable: false })
  eventId: string

  @ManyToOne(() => UserEntity)
  user: UserEntity

  @ManyToOne(() => EventEntity)
  event: TicketEntity
}
