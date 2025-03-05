import { CreateTicketCommand } from '@domain/ticket/application/create-ticket.command'
import { CreateTicketDto } from '@domain/ticket/infra/http/validators/create-ticket.dto'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

@Controller('tickets')
export class TicketController {
  constructor(private commandBus: CommandBus) {}

  @Post('')
  async postTicket(
    @Body() { eventId }: CreateTicketDto,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new CreateTicketCommand(userId, eventId))
  }
}
