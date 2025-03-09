export class InvalidEventOperationError extends Error {
  constructor(message: string) {
    super(`Invalid event operation ${message} `)
  }
}
