import { CreateEventCommand } from '@domain/events/application/commands/create-event.command'
import { RegisterEventAddressCommand } from '@domain/events/application/commands/register-event-address.command'
import { UpdateEventDetailsCommand } from '@domain/events/application/commands/update-event-details.command'
import { UpdateEventPriceCommand } from '@domain/events/application/commands/update-event-price.command'
import { FetchEventParticipantsQuery } from '@domain/events/application/queries/fetch-event-participants.query'
import { FetchEventsQuery } from '@domain/events/application/queries/fetch-events.query'
import { RegisterEventAddressDto } from '@domain/events/infra/http/dto/register-event-address.dto'
import { UpdateEventDto } from '@domain/events/infra/http/dto/update-event.dto'
import { UpdatePriceEventDto } from '@domain/events/infra/http/dto/update-price-event.dto'
import { getParticipantsResponseSchema } from '@domain/events/infra/http/models/get-participants-response.schema'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { ParseUUIDPipe } from '@infra/utils/parse-uuid.pipe'
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
    @Param('id', ParseUUIDPipe) eventId: string,
  ) {
    await this.commandBus.execute(new UpdateEventDetailsCommand(eventId, userId, data))
  }

  @Put('/:id/price')
  async updateEventPrice(
    @Body() dto: UpdatePriceEventDto,
    @Param('id', ParseUUIDPipe) eventId: string,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new UpdateEventPriceCommand(userId, eventId, dto.price))
  }

  @Post('/:id/address')
  async registerEventAddress(
    @Body() body: RegisterEventAddressDto,
    @Param('id', ParseUUIDPipe) eventId: string,
    @User('id') userId: string,
  ) {
    await this.commandBus.execute(new RegisterEventAddressCommand(userId, eventId, body))
  }

  @Get('/:id/participants')
  async getParticipants(@Param('id', ParseUUIDPipe) eventId: string, @User('id') userId: string) {
    const results = await this.queryBus.execute(new FetchEventParticipantsQuery(eventId, userId))

    console.log(results)

    return getParticipantsResponseSchema.parse(results)
  }
}
