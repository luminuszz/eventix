import { AggregateRoot } from "@nestjs/cqrs";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class DomainEntity extends AggregateRoot {
  constructor() {
    super();
    this.autoCommit = false;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
