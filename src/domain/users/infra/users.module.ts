import { AuthGuard } from '@domain/users/application/auth.guard'
import { CommandHandlers } from '@domain/users/application/commands'
import { HashProvider } from '@domain/users/contracts/hash.provider'
import { AuthController } from '@domain/users/infra/http/auth.controller'
import { EncryptModule } from '@infra/encrypt/encrypt.module'
import { EncryptService } from '@infra/encrypt/encrypt.service'
import { EnvService } from '@infra/env/env.service'
import { EXPIRES_AT_TOKEN } from '@infra/utils/jwt'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../domain/users.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    EncryptModule,
    JwtModule.registerAsync({
      useFactory: (env: EnvService): JwtModuleOptions => {
        return {
          global: true,
          secret: env.get('JWT_SECRET'),
          signOptions: {
            expiresIn: EXPIRES_AT_TOKEN,
          },
        }
      },
      inject: [EnvService],
    }),
  ],
  providers: [
    ...CommandHandlers,
    {
      provide: HashProvider,
      useClass: EncryptService,
    },
    AuthGuard,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [AuthGuard],
  controllers: [AuthController],
})
export class UsersModule {}
