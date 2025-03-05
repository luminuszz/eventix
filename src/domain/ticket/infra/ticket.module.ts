import { EventEntity } from '@domain/events/entities/event.entity'
import { CreateTicketCommandHandler } from '@domain/ticket/application/create-ticket.command'
import { OnTicketCreatedEventHandler } from '@domain/ticket/application/on-ticket-created.event'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { TicketController } from '@domain/ticket/infra/http/ticket.controller'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TicketEntity, EventEntity])],
  providers: [CreateTicketCommandHandler, OnTicketCreatedEventHandler],
  controllers: [TicketController],
})
export class TicketModule {}
