import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { DomainEvent } from '@domain/shared/domain.event'

export class PaymentConfirmedEvent extends DomainEvent {
  constructor(public readonly payment: PaymentEntity) {
    super()
  }

  getEventName(): string {
    return PaymentConfirmedEvent.name
  }
}
