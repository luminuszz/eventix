import { CreateTicketCommand } from '@domain/ticket/application/commands/create-ticket.command'
import { MakeCheckInCommand } from '@domain/ticket/application/commands/make-check-in.command'
import { FetchUserTicketsQuery } from '@domain/ticket/application/queries/fetch-user-tickets.query'
import { paginatedTicketSchema } from '@domain/ticket/infra/http/model/paginated-ticket.schema'
import { CreateTicketDto } from '@domain/ticket/infra/http/validators/create-ticket.dto'
import { FetchTicketsDto } from '@domain/ticket/infra/http/validators/fetch-tickets.dto'
import { MakeCheckInDto } from '@domain/ticket/infra/http/validators/make-check-in.dto'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

@Controller('tickets')
export class TicketController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('')
  async postTicket(@Body() dto: CreateTicketDto, @User('id') userId: string) {
    await this.commandBus.execute(new CreateTicketCommand(userId, dto.eventId))
  }

  @Post('check-in')
  async makeCheckIn(@Body() dto: MakeCheckInDto, @User('id') userId: string) {
    await this.commandBus.execute(new MakeCheckInCommand(dto.ticketId, userId))
  }

  @Get('')
  async getTickets(@User('id') userId: string, @Query() params: FetchTicketsDto) {
    return paginatedTicketSchema.parse(
      await this.queryBus.execute(new FetchUserTicketsQuery(userId, params.page, params.limit)),
    )
  }
}
