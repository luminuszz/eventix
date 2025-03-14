import { CreateSessionCommandHandler } from '@domain/users/application/commands/create-session.command'
import { CreateUserCommandHandler } from '@domain/users/application/commands/create-user.command'
import { UpdateUserCommandHandler } from '@domain/users/application/commands/update-user.command'

export const CommandHandlers = [
  CreateSessionCommandHandler,
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
]
