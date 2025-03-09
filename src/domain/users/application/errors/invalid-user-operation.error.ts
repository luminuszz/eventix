export class InvalidUserOperationError extends Error {
  constructor(message?: string) {
    super(`Invalid user operation: ${message}`)
  }
}
