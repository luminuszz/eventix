import { UserEntity } from '@domain/users/users.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreateEventCommandHandler } from './commands/create-event.command'
import { EventController } from './controllers/events.controller'
import { EventEntity } from './entities/event.entity'
import { FetchEventsQueryHandler } from './queries/fetch-events.query'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity])],
  providers: [CreateEventCommandHandler, FetchEventsQueryHandler],
  controllers: [EventController],
})
export class EventsModule {}
