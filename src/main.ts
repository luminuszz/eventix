import { EnvService } from '@infra/env/env.service'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const adapter = new FastifyAdapter()

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    rawBody: true,
  })

  const env = app.get(EnvService)

  const apiPort = env.get('API_PORT')

  await app.listen(apiPort, '0.0.0.0')
}
void bootstrap()
