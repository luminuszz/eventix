import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateEventCommandHandler } from "./commands/create-event.command";
import { EventEntity } from "./entities/event.entity";
import { EventController } from "./events.controller";
import { FetchEventsQueryHandler } from "./queries/fetch-events.query";

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [CreateEventCommandHandler, FetchEventsQueryHandler],
  controllers: [EventController],
})
export class EventsModule {}
