import { UserEntity } from '@domain/users/domain/users.entity'

import { EventTypeEnum } from '@domain/events/domain/entities/event-type.enum'
import { EventPriceUpdatedEvent } from '@domain/events/domain/events/event-price-updated.event'
import { DomainEntity } from '@domain/shared/domain.entity'
import { DomainError } from '@domain/shared/domain.error'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm'

@Entity('events')
export class EventEntity extends DomainEntity {
  @Column()
  name: string

  @Column()
  description: string

  @Column()
  ownerId: string

  @Column({ type: 'int' })
  maxCapacity: number

  @Column({ type: 'float', nullable: true })
  price: number | null

  @Column({ enum: EventTypeEnum, type: 'enum', default: EventTypeEnum.FREE })
  type: EventTypeEnum

  @ManyToOne(
    () => UserEntity,
    (user) => user.id,
  )
  owner: UserEntity

  @OneToMany(
    () => TicketEntity,
    (ticket) => ticket.event,
  )
  participants: Relation<TicketEntity[]>

  changeCapacity(capacity: number) {
    if (capacity < 0) {
      throw new DomainError('Max capacity must be greater than 0')
    }

    if (capacity < this.participants.length) {
      throw new DomainError('Max capacity cannot be less than the number of participants')
    }

    this.maxCapacity = capacity
  }

  changePrice(price: number) {
    if (this.type === EventTypeEnum.FREE) {
      throw new DomainError('Cannot change price of a free event')
    }

    if (price <= 0) {
      throw new DomainError('Price must be greater than 0')
    }

    this.price = price

    this.apply(new EventPriceUpdatedEvent(this))
  }
}
