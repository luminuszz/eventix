import { randomUUID } from 'node:crypto'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { EventUpdated } from '@domain/events/domain/events/event-updated'
import { Command, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class UpdateEventDetailsCommand extends Command<{ actionId: string }> {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public event: Partial<{
      name: string
      description: string
      maxCapacity: number
    }>,
  ) {
    super()
  }
}

@CommandHandler(UpdateEventDetailsCommand)
export class UpdateEventDetailsCommandHandler
  implements ICommandHandler<UpdateEventDetailsCommand>
{
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,

    private publisher: EventPublisher,
  ) {}

  async execute({
    eventId,
    event: dto,
    userId,
  }: UpdateEventDetailsCommand): Promise<{ actionId: string }> {
    const event = this.publisher.mergeObjectContext(
      await this.eventRepository.findOneOrFail({
        where: {
          id: eventId,
          ownerId: userId,
        },
        relations: {
          participants: true,
        },
      }),
    )

    event.name = dto.name ?? event.name
    event.description = dto.description ?? event.description

    event.changeCapacity(dto.maxCapacity ?? event.maxCapacity)

    await this.eventRepository.save(event)

    event.apply(new EventUpdated(event))

    event.commit()

    return {
      actionId: randomUUID(),
    }
  }
}
