import { UserEntity } from '@domain/users/users.entity'
import { DomainEntity } from 'src/domain/shared/base.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity('events')
export class EventEntity extends DomainEntity {
  @Column()
  name: string

  @Column()
  description: string

  @Column()
  ownerId: string

  @ManyToOne(() => UserEntity)
  owner: UserEntity
}
