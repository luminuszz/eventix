import { EventPriceUpdatedEvent } from '@domain/events/domain/events/event-price-updated.event'
import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(EventPriceUpdatedEvent)
export class OnEventPriceUpdatedEventHandler implements IEventHandler<EventPriceUpdatedEvent> {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  async handle({ event }: EventPriceUpdatedEvent) {
    if (event.price) {
      await this.paymentGateway.updateProductPrice({ price: event.price, eventId: event.id })
    }
  }
}
