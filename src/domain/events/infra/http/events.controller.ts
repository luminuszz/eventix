import {CreateEventCommand} from '@domain/events/application/commands/create-event.command'
import {FetchEventsQuery} from '@domain/events/application/queries/fetch-events.query'
import {User} from '@domain/users/infra/http/user-auth.decorator'
import {Body, Controller, Get, Post} from '@nestjs/common'
import {CommandBus, QueryBus} from '@nestjs/cqrs'
import {CreateEventDto} from './dto/create-event.dto'

@Controller('events')
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createEvent(@Body() data: CreateEventDto, @User('id') userId: string) {
    await this.commandBus.execute(
      new CreateEventCommand(
        data.name,
        data.description,
        userId,
        data.maxCapacity,
        data.type,
        data.price,
      ),
    )
  }

  @Get()
  async fetchEvents() {
    return await this.queryBus.execute(new FetchEventsQuery())
  }
}
