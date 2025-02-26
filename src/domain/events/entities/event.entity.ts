import { DomainEntity } from "src/domain/shared/base.entity";
import { Column, Entity } from "typeorm";

@Entity("events")
export class EventEntity extends DomainEntity {
  @Column()
  name: string;

  @Column()
  description: string;
}
