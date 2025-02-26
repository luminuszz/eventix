import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EncryptModule } from "src/infra/encrypt/encrypt.module";
import { EncryptService } from "src/infra/encrypt/encrypt.service";
import { CreateUserCommandHandler } from "./commands/create-user.command";
import { HashProvider } from "./contracts/hash.provider";
import { UserEntity } from "./users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EncryptModule],
  providers: [
    CreateUserCommandHandler,
    {
      provide: HashProvider,
      useClass: EncryptService,
    },
  ],
})
export class UsersModule {}
