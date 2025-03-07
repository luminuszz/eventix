import { UserEntity } from '@domain/users/domain/users.entity'

import { EventTypeEnum } from '@domain/events/entities/event-type.enum'
import { DomainEntity } from '@domain/shared/domain.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

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
  price: number

  @Column({ enum: EventTypeEnum, type: 'enum', default: EventTypeEnum.FREE })
  type: EventTypeEnum

  @ManyToOne(
    () => UserEntity,
    (user) => user.id,
  )
  owner: UserEntity
}
