export class PaymentConfirmedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly ticketId: string,
  ) {}
}
