import { TicketCreatedEvent } from '@domain/ticket/domain/events/ticket-created.event'
import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(TicketCreatedEvent)
export class OnTicketCreatedEventHandler
  implements IEventHandler<TicketCreatedEvent>
{
  private logger = new Logger(OnTicketCreatedEventHandler.name)

  handle(event: TicketCreatedEvent) {
    this.logger.log(
      `[OnTicketCreatedEventHandler] ${event} -> sending email with new ticket`,
    )
  }
}
