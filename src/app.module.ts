import { DomainModule } from '@domain/domain.module'
import { DatabaseModule } from '@infra/database/database.module'
import { EnvModule } from '@infra/env/env.module'
import { ZodValidatorGlobalPipe } from '@infra/utils/zod/zod-validator-global.pipe'
import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule.forRoot(), EnvModule, DatabaseModule, DomainModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidatorGlobalPipe }],
})
export class AppModule {}
