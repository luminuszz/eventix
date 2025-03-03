import { AuthGuard } from '@domain/users/auth.guard'
import { CommandHandlers } from '@domain/users/commands'
import { AuthController } from '@domain/users/controllers/auth.controller'
import { EnvService } from '@infra/env/env.service'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EncryptModule } from 'src/infra/encrypt/encrypt.module'
import { EncryptService } from 'src/infra/encrypt/encrypt.service'
import { HashProvider } from './contracts/hash.provider'
import { UserEntity } from './users.entity'

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
            expiresIn: '3d',
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
