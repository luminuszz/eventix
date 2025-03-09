import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { DomainEntity } from '@domain/shared/domain.entity'
import { TicketApprovedEvent } from '@domain/ticket/domain/events/ticket-approved.event'
import { TicketCheckedInEvent } from '@domain/ticket/domain/events/ticket-checked-in.event'
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

  aprove() {
    this.status = TicketStatusEnum.CONFIRMED
    this.apply(new TicketApprovedEvent(this))
  }

  checkIn() {
    this.status = TicketStatusEnum.CHECKED_IN
    this.apply(new TicketCheckedInEvent(this))
  }

  get isConfirmed() {
    return this.status === TicketStatusEnum.CONFIRMED
  }

  @ManyToOne(() => UserEntity)
  user: UserEntity

  @ManyToOne(() => EventEntity)
  event: EventEntity
}
