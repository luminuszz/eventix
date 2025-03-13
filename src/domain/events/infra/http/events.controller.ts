import { CreateEventCommand } from '@domain/events/application/commands/create-event.command'
import { RegisterEventAddressCommand } from '@domain/events/application/commands/register-event-address.command'
import { UpdateEventDetailsCommand } from '@domain/events/application/commands/update-event-details.command'
import { UpdateEventPriceCommand } from '@domain/events/application/commands/update-event-price.command'
import { FetchEventsQuery } from '@domain/events/application/queries/fetch-events.query'
import { RegisterEventAddressDto } from '@domain/events/infra/http/dto/register-event-address.dto'
import { UpdateEventDto } from '@domain/events/infra/http/dto/update-event.dto'
import { UpdatePriceEventDto } from '@domain/events/infra/http/dto/update-price-event.dto'
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
    await this.commandBus.execute(new UpdateEventDetailsCommand(eventId, userId, data))
  }

  @Put('/:id/price')
  async updateEventPrice(
    @Body() dto: UpdatePriceEventDto,
    @Param('id', ParseUUIDPipePipe) eventId: string,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new UpdateEventPriceCommand(userId, eventId, dto.price))
  }

  @Post('/:id/address')
  async registerEventAddress(
    @Body() body: RegisterEventAddressDto,
    @Param('id', ParseUUIDPipePipe) eventId: string,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new RegisterEventAddressCommand(userId, eventId, body))
  }
}
