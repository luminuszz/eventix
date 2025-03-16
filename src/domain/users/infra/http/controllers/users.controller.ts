import { CreateUserCommand } from '@domain/users/application/commands/create-user.command'
import { UpdateUserCommand } from '@domain/users/application/commands/update-user.command'
import { FetchUserDetailsQuery } from '@domain/users/application/queries/fetch-user-details.query'
import { IsPublic } from '@domain/users/infra/auth.guard'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { RegisterUserDto } from '@domain/users/infra/http/validators/register-user.dto'
import { UpdateUserDto } from '@domain/users/infra/http/validators/update-user.dto'
import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Put('')
  async updateUser(@Body() dto: UpdateUserDto, @User('id') userId: string) {
    await this.commandBus.execute(new UpdateUserCommand(userId, dto))
  }

  @Get('/me')
  async getCurrentSession(@User('id') userId: string) {
    return await this.queryBus.execute(new FetchUserDetailsQuery(userId))
  }

  @IsPublic()
  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    await this.commandBus.execute(new CreateUserCommand(data))
  }
}
