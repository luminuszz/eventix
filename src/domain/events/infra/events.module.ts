import { CreateEventCommandHandler } from '@domain/events/application/commands/create-event.command'
import { UpdateEventDetailsCommandHandler } from '@domain/events/application/commands/update-event-details.command'
import { UpdateEventPriceCommandHandler } from '@domain/events/application/commands/update-event-price.command'
import { FetchEventsQueryHandler } from '@domain/events/application/queries/fetch-events.query'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { EventController } from '@domain/events/infra/http/events.controller'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity])],
  providers: [
    CreateEventCommandHandler,
    FetchEventsQueryHandler,
    UpdateEventDetailsCommandHandler,
    UpdateEventPriceCommandHandler,
  ],
  controllers: [EventController],
})
export class EventsModule {}
