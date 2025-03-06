import { EnvService } from '@infra/env/env.service'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const adapter = new FastifyAdapter()

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      rawBody: true,
    },
  )
  const apiPort = app.get(EnvService).get('API_PORT')

  await app.listen(apiPort, '0.0.0.0')
}
void bootstrap()
