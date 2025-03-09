import {EventEntity} from '@domain/events/domain/entities/event.entity'
import {Global, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {EnvModule} from '../env/env.module'
import {EnvService} from '../env/env.service'

@Global()
@Module({
  imports: [
    EnvModule,
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
  ],
})
export class DatabaseModule {}
