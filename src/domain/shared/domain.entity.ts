import { DomainEvent } from '@domain/shared/domain.event'
import { AggregateRoot } from '@nestjs/cqrs'
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class DomainEntity extends AggregateRoot<DomainEvent> {
  constructor() {
    super()
    this.autoCommit = false
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
