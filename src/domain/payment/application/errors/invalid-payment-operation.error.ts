export class InvalidPaymentOperationError extends Error {
  constructor(message: string) {
    super(`Invalid payment operation ${message} `)
  }
}
