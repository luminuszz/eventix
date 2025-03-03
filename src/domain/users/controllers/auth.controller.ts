import { IsPublic } from '@domain/users/auth.guard'
import { CreateSessionCommand } from '@domain/users/commands/create-session.command'
import { CreateSessionDto } from '@domain/users/controllers/validators/create-session.dto'
import { RegisterUserDto } from '@domain/users/controllers/validators/register-user.dto'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUserCommand } from '../commands/create-user.command'

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @IsPublic()
  @Post('sign-up')
  async register(@Body() data: RegisterUserDto) {
    await this.commandBus.execute(new CreateUserCommand(data))
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async createSession(@Body() data: CreateSessionDto) {
    const { token } = await this.commandBus.execute(
      new CreateSessionCommand(data.email, data.password),
    )

    return {
      token,
    }
  }
}
