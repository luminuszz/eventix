import { UserEntity } from '@domain/users/domain/users.entity'

import { EventAddressEntity } from '@domain/events/domain/entities/event-address.entity'
import { EventTypeEnum } from '@domain/events/domain/entities/event-type.enum'
import { EventOwnerChangedEvent } from '@domain/events/domain/events/event-owner-changed.event'
import { EventPriceUpdatedEvent } from '@domain/events/domain/events/event-price-updated.event'
import { DomainEntity } from '@domain/shared/domain.entity'
import { DomainError } from '@domain/shared/domain.error'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm'

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

  @JoinColumn()
  @OneToOne(
    () => EventAddressEntity,
    (address) => address.event,
    {
      cascade: true,
    },
  )
  address: Relation<EventAddressEntity>

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

  changeOwner(ownerId: string) {
    if (ownerId === this.ownerId) {
      throw new DomainError('Cannot transfer ownership to the same user')
    }

    this.ownerId = ownerId

    this.apply(new EventOwnerChangedEvent(this))
  }
}
