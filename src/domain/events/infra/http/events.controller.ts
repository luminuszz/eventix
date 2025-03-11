import { CreateEventCommand } from '@domain/events/application/commands/create-event.command'
import { UpdateEventCommand } from '@domain/events/application/commands/update-event.command'
import { FetchEventsQuery } from '@domain/events/application/queries/fetch-events.query'
import { UpdateEventDto } from '@domain/events/infra/http/dto/update-event.dto'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { ParseUUIDPipePipe } from '@infra/utils/parse-uuid.pipe'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { createEventSchemaByEventType } from './dto/create-event.dto'

@Controller('events')
export class EventController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createEvent(@Body() body: unknown, @User('id') userId: string) {
    const data = createEventSchemaByEventType.parse(body)

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

  @Put('/:id')
  async updateEvent(
    @Body() data: UpdateEventDto,
    @User('id') userId: string,
    @Param('id', ParseUUIDPipePipe) eventId: string,
  ) {
    await this.commandBus.execute(new UpdateEventCommand(eventId, userId, data))
  }
}
