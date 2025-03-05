import { EventTypeEnum } from '@domain/events/entities/event-type.enum'
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
    public readonly type: EventTypeEnum,
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
    type,
  }: CreateEventCommand) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) throw new BadRequestException('User not found')

    const event = this.publisher.mergeObjectContext(
      this.eventRepository.create({
        description,
        name,
        maxCapacity,
        ownerId: user.id,
        type,
      }),
    )

    await this.eventRepository.save(event)

    event.commit()
  }
}
