import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { EventsModule } from '@domain/events/infra/events.module'
import { PaymentModule } from '@domain/payment/infra/payment.module'
import { TicketModule } from '@domain/ticket/infra/ticket.module'
import { UsersModule } from '@domain/users/infra/users.module'
import { EnvModule } from '@infra/env/env.module'
import { EnvService } from '@infra/env/env.service'
import { ExceptionHandlerInterceptor } from '@infra/utils/exception-handler.interceptor'
import { ZodValidatorGlobalPipe } from '@infra/utils/zod/zod-validator-global.pipe'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (env: EnvService) => {
        return {
          connection: {
            host: env.get('REDIS_HOST'),
            port: env.get('REDIS_PORT'),
          },
        }
      },
      inject: [EnvService],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (env: EnvService) => {
        const isDev = env.get('ENVIRONMENT') === 'development'
        return {
          type: 'postgres',
          url: env.get('DB_URL'),
          entities: [EventEntity],
          autoLoadEntities: true,
          synchronize: isDev,
          logging: isDev,
        }
      },
      inject: [EnvService],
    }),
    CqrsModule.forRoot(),
    EnvModule,
    EventsModule,
    PaymentModule,
    TicketModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidatorGlobalPipe },
    { provide: APP_INTERCEPTOR, useClass: ExceptionHandlerInterceptor },
  ],
})
export class AppModule {}
