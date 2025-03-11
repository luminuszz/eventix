export class DomainError extends Error {
  constructor(message?: string) {
    super(`Domain error: ${message}`)
  }
}
