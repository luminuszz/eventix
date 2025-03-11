import { CreateEventCommandHandler } from '@domain/events/application/commands/create-event.command'
import { UpdateEventCommandHandler } from '@domain/events/application/commands/update-event.command'
import { FetchEventsQueryHandler } from '@domain/events/application/queries/fetch-events.query'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { EventController } from '@domain/events/infra/http/events.controller'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity])],
  providers: [CreateEventCommandHandler, FetchEventsQueryHandler, UpdateEventCommandHandler],
  controllers: [EventController],
})
export class EventsModule {}
