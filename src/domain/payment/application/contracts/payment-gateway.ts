export abstract class PaymentGateway {
  abstract generatePaymentUrl(paymentId: string): Promise<string>
}
