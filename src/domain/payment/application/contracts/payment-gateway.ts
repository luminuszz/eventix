export abstract class PaymentGateway {
  abstract generatePaymentUrl(paymentId: string, email: string): Promise<string>
}
