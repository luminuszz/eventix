import { EventUpdated } from '@domain/events/domain/events/event-updated'
import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(EventUpdated)
export class OnEventUpdatedHandler implements IEventHandler<EventUpdated> {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  async handle({ event }: EventUpdated) {
    await this.paymentGateway.updateProductDetails({
      name: event.name,
      description: event.description,
      eventId: event.id,
    })
  }
}
