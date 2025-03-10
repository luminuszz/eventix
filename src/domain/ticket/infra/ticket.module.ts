import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { CreateTicketCommandHandler } from '@domain/ticket/application/commands/create-ticket.command'
import { MakeCheckInCommandHandler } from '@domain/ticket/application/commands/make-check-in.command'
import { OnPaymentApprovedEventHandler } from '@domain/ticket/application/handlers/on-payment-approved-event.handler'
import { OnTicketCreatedEventHandler } from '@domain/ticket/application/handlers/on-ticket-created.event'
import { FetchUserTicketsQueryHandler } from '@domain/ticket/application/queries/fetch-user-tickets.query'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { TicketController } from '@domain/ticket/infra/http/ticket.controller'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EventEntity, TicketEntity])],
  providers: [
    CreateTicketCommandHandler,
    OnTicketCreatedEventHandler,
    OnPaymentApprovedEventHandler,
    MakeCheckInCommandHandler,
    FetchUserTicketsQueryHandler,
  ],
  controllers: [TicketController],
})
export class TicketModule {}
