import { UserEntity } from '@domain/users/domain/users.entity'
import { BadRequestException } from '@nestjs/common'
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEntity } from '../entities/event.entity'

export class CreateEventCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly userId: string,
    public readonly maxCapacity: number,
  ) {}
}

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler
  implements ICommandHandler<CreateEventCommand>
{
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({
    description,
    name,
    userId,
    maxCapacity,
  }: CreateEventCommand) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) throw new BadRequestException('User not found')

    const event = this.publisher.mergeObjectContext(
      this.eventRepository.create({
        description,
        name,
        maxCapacity,
        ownerId: user.id,
      }),
    )

    await this.eventRepository.save(event)

    event.commit()
  }
}
