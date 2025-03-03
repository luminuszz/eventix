import { CreateSessionCommandHandler } from '@domain/users/commands/create-session.command'
import { CreateUserCommandHandler } from '@domain/users/commands/create-user.command'

export const CommandHandlers = [
  CreateSessionCommandHandler,
  CreateUserCommandHandler,
]
