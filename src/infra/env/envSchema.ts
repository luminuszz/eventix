import { z } from 'zod'

export const envSchema = z.object({
  DB_URL: z.string(),
  API_PORT: z.coerce.number(),
  ENVIRONMENT: z.enum(['development', 'production']),
  JWT_SECRET: z.string(),
  STRIPE_PRIVATE_API_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_HOST: z.string(),
})

export type EnvConfig = z.infer<typeof envSchema>
