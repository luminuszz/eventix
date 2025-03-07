import { CreateTicketCommand } from '@domain/ticket/application/create-ticket.command'
import { MakeCheckInCommand } from '@domain/ticket/application/make-check-in.command'
import { CreateTicketDto } from '@domain/ticket/infra/http/validators/create-ticket.dto'
import { MakeCheckInDto } from '@domain/ticket/infra/http/validators/make-check-in.dto'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

@Controller('tickets')
export class TicketController {
  constructor(private commandBus: CommandBus) {}

  @Post('')
  async postTicket(@Body() dto: CreateTicketDto, @User('id') userId: string) {
    await this.commandBus.execute(new CreateTicketCommand(userId, dto.eventId))
  }

  @Post('check-in')
  async makeCheckIn(@Body() dto: MakeCheckInDto, @User('id') userId: string) {
    await this.commandBus.execute(new MakeCheckInCommand(dto.ticketId, userId))
  }
}
