import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { EventsModule } from "./domain/events/events.module";
import { UsersModule } from "./domain/users/users.module";
import { DatabaseModule } from "./infra/database/database.module";
import { EnvModule } from "./infra/env/env.module";
import { ZodValidatorGlobalPipe } from "./infra/utils/zod/zod-validator-global.pipe";

@Module({
  imports: [CqrsModule.forRoot(), EnvModule, DatabaseModule, EventsModule, UsersModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidatorGlobalPipe }],
})
export class AppModule {}
