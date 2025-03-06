import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { z } from 'zod'
import { EnvService } from './env.service'

const envSchema = z.object({
  DB_URL: z.string(),
  API_PORT: z.coerce.number(),
  ENVIRONMENT: z.enum(['development', 'production']),
  JWT_SECRET: z.string(),
  STRIPE_PRIVATE_API_KEY: z.string(),
  STRIPE_PRICE_ID: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
})

export type EnvConfig = z.infer<typeof envSchema>

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
