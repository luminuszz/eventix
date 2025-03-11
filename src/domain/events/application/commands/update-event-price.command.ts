import { randomUUID } from 'node:crypto'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { Command, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class UpdateEventPriceCommand extends Command<{ actionId: string }> {
  constructor(
    public readonly userId: string,
    public readonly eventId: string,
    public readonly newPrice: number,
  ) {
    super()
  }
}

@CommandHandler(UpdateEventPriceCommand)
export class UpdateEventPriceCommandHandler implements ICommandHandler<UpdateEventPriceCommand> {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,

    private readonly publisher: EventPublisher,
  ) {}

  async execute({
    eventId,
    userId,
    newPrice,
  }: UpdateEventPriceCommand): Promise<{ actionId: string }> {
    const event = this.publisher.mergeObjectContext(
      await this.eventRepository.findOneOrFail({
        where: {
          id: eventId,
          ownerId: userId,
        },
      }),
    )

    event.changePrice(newPrice)

    await this.eventRepository.save(event)

    event.commit()

    return {
      actionId: randomUUID(),
    }
  }
}
