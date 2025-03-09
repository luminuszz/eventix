import {InvalidEventOperationError} from '@domain/events/application/errors/invalid-event-operation.error'
import {EventTypeEnum} from '@domain/events/domain/entities/event-type.enum'
import {EventEntity} from '@domain/events/domain/entities/event.entity'
import {EventCreated} from '@domain/events/domain/events/event-created'
import {UserEntity} from '@domain/users/domain/users.entity'
import {CommandHandler, EventPublisher, ICommandHandler} from '@nestjs/cqrs'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

export class CreateEventCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly userId: string,
    public readonly maxCapacity: number,
    public readonly type: EventTypeEnum,
    public readonly price?: number,
  ) {}
}

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ description, name, userId, maxCapacity, type, price }: CreateEventCommand) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) throw new InvalidEventOperationError('User not found')

    const event = this.publisher.mergeObjectContext(
      this.eventRepository.create({
        description,
        name,
        maxCapacity,
        ownerId: user.id,
        type,
        price: price ?? 0,
      }),
    )

    event.apply(new EventCreated(event))

    await this.eventRepository.save(event)

    event.commit()
  }
}
