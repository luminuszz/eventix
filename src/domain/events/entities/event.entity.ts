import { UserEntity } from '@domain/users/domain/users.entity'

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

  @ManyToOne(() => UserEntity)
  owner: UserEntity
}
