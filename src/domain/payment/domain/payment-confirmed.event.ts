import { PaymentEntity } from '@domain/payment/domain/payment.entity'

export class PaymentConfirmedEvent {
  constructor(public readonly payment: PaymentEntity) {}
}
