import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { DomainEntity } from '@domain/shared/domain.entity'
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm'

@Entity('event_address')
export class EventAddressEntity extends DomainEntity {
  @Column()
  street: string

  @Column()
  city: string

  @Column()
  zipCode: string

  @Column()
  country: string

  @Column()
  eventId: string

  @JoinColumn()
  @OneToOne(() => EventEntity)
  event: Relation<EventEntity>
}
