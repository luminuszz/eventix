import { EventCreated } from '@domain/events/domain/events/event-created'
import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(EventCreated)
export class OnEventCreatedEventHandler implements IEventHandler<EventCreated> {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  async handle({ event }: EventCreated) {
    if (event.type === 'PAID' && event.price && event.price > 0) {
      await this.paymentGateway.createProduct({
        id: event.id,
        name: event.name,
        price: event.price,
      })
    }
  }
}
