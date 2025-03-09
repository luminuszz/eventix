import {HashProvider} from '@domain/users/contracts/hash.provider'
import {UserCreatedEvent} from '@domain/users/domain/events/user-created.event'
import {BadRequestException} from '@nestjs/common'
import {CommandHandler, EventPublisher, ICommandHandler} from '@nestjs/cqrs'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {UserEntity} from '../../domain/users.entity'

export class CreateUserCommand {
  constructor(
    public payload: {
      email: string
      password: string
      firstName: string
      lastName: string
    },
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventPublisher: EventPublisher,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute({ payload }: CreateUserCommand) {
    const userExists = await this.userRepository.findOne({
      where: { email: payload.email },
    })

    if (userExists) {
      throw new BadRequestException('User already exists')
    }

    const passwordHash = await this.hashProvider.hash(payload.password)

    const newUser = this.eventPublisher.mergeObjectContext(
      this.userRepository.create({
        email: payload.email,
        passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
      }),
    )

    newUser.apply(new UserCreatedEvent(newUser))

    await this.userRepository.save(newUser)

    newUser.commit()
  }
}
