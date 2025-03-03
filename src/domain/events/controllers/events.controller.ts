import { Body, Controller, Get, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateEventCommand } from '../commands/create-event.command'
import { FetchEventsQuery } from '../queries/fetch-events.query'
import { CreateEventDto } from './dto/create-event.dto'

@Controller('events')
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createEvent(@Body() data: CreateEventDto) {
    const userId = ''

    await this.commandBus.execute(
      new CreateEventCommand(data.name, data.description, userId),
    )
  }

  @Get()
  async fetchEvents() {
    return await this.queryBus.execute(new FetchEventsQuery())
  }
}
