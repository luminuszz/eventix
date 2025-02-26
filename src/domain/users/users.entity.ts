import { Column, Entity } from "typeorm";
import { DomainEntity } from "../shared/base.entity";

@Entity("users")
export class UserEntity extends DomainEntity {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;
}
