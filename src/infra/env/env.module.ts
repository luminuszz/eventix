import { envSchema } from '@infra/env/envSchema'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvService } from './env.service'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
