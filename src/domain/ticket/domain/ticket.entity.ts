import { EventEntity } from '@domain/events/entities/event.entity'
import { DomainEntity } from '@domain/shared/domain.entity'
import { TicketApprovedEvent } from '@domain/ticket/domain/ticket-approved.event'
import { TicketStatusEnum } from '@domain/ticket/domain/ticket.status.enum'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity('tickets')
export class TicketEntity extends DomainEntity {
  @Column({ nullable: false })
  userId: string

  @Column({ nullable: false })
  eventId: string

  @Column({
    type: 'enum',
    enum: TicketStatusEnum,
    default: TicketStatusEnum.PENDING,
  })
  status: TicketStatusEnum

  @ManyToOne(() => UserEntity)
  user: UserEntity

  @ManyToOne(() => EventEntity)
  event: TicketEntity

  aprove() {
    this.status = TicketStatusEnum.CONFIRMED
    this.apply(new TicketApprovedEvent(this))
  }
}
