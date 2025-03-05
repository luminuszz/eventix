import { TicketCreatedEvent } from '@domain/ticket/domain/ticket-created.event'
import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(TicketCreatedEvent)
export class OnTicketCreatedEventHandler
  implements IEventHandler<OnTicketCreatedEventHandler>
{
  private logger = new Logger(OnTicketCreatedEventHandler.name)

  handle(event: OnTicketCreatedEventHandler) {
    this.logger.log(
      `[OnTicketCreatedEventHandler] ${event} -> sending email with new ticket`,
    )
  }
}
