import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateEventCommand } from "./commands/create-event.command";
import { FetchEventsQuery } from "./queries/fetch-events.query";

@Controller("events")
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async createEvent(@Body() data: { name: string; description: string }) {
    await this.commandBus.execute(new CreateEventCommand(data.name, data.description));
  }

  @Get()
  async fetchEvents() {
    return await this.queryBus.execute(new FetchEventsQuery());
  }
}
