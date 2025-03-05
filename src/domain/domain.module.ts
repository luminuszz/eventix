import { EventsModule } from '@domain/events/events.module'
import { TicketModule } from '@domain/ticket/infra/ticket.module'
import { UsersModule } from '@domain/users/users.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersModule, EventsModule, TicketModule],
})
export class DomainModule {}
