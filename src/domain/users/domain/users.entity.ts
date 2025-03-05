import { DomainEntity } from '@domain/shared/domain.entity'
import { Column, Entity } from 'typeorm'

@Entity('users')
export class UserEntity extends DomainEntity {
  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  passwordHash: string

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string
}
