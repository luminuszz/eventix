import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands/create-user.command";
import { RegisterUserDto } from "./validators/register-user";

@Controller("auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("register")
  async register(@Body() data: RegisterUserDto) {
    await this.commandBus.execute(new CreateUserCommand(data));
  }
}
