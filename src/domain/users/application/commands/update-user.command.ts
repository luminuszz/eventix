import {UserEntity} from '@domain/users/domain/users.entity'
import {Command, CommandHandler, EventPublisher, ICommandHandler} from '@nestjs/cqrs'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

export class UpdateUserCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly dto: Partial<{
      email: string
      firstName: string
      lastName: string
    }>,
  ) {
    super()
  }
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ userId, dto }: UpdateUserCommand): Promise<void> {
    const user = this.eventPublisher.mergeObjectContext(
      await this.userRepository.findOneOrFail({
        where: {
          id: userId,
        },
      }),
    )

    dto.email && user.changeEmail(dto.email)
    user.firstName = dto.firstName ?? user.firstName
    user.lastName = dto.lastName ?? user.lastName

    await this.userRepository.save(user)

    user.commit()
  }
}
