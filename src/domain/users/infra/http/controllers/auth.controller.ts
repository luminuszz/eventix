import { CreateSessionCommand } from '@domain/users/application/commands/create-session.command'
import { IsPublic } from '@domain/users/infra/auth.guard'
import { CreateSessionDto } from '@domain/users/infra/http/validators/create-session.dto'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

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
