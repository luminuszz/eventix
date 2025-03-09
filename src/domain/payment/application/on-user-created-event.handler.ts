import {PaymentGateway} from '@domain/payment/application/contracts/payment-gateway'
import {UserCreatedEvent} from '@domain/users/domain/events/user-created.event'
import {EventsHandler, IEventHandler} from '@nestjs/cqrs'

@EventsHandler(UserCreatedEvent)
export class OnUserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  async handle({ user }: UserCreatedEvent) {
    await this.paymentGateway.registerCostumer({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    })
  }
}
