import { randomUUID } from 'node:crypto'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { Command, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class TransferEventOwnerShipCommand extends Command<{ actionId: string }> {
  constructor(
    public readonly eventId: string,
    public readonly ownerId: string,
    public readonly nextOwnerId: string,
  ) {
    super()
  }
}

@CommandHandler(TransferEventOwnerShipCommand)
export class TransferEventOwnerShipCommandHandler
  implements ICommandHandler<TransferEventOwnerShipCommand>
{
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: TransferEventOwnerShipCommand): Promise<{ actionId: string }> {
    const event = this.publisher.mergeObjectContext(
      await this.eventRepository.findOneOrFail({
        where: {
          id: command.eventId,
          ownerId: command.ownerId,
        },
      }),
    )

    event.changeOwner(command.nextOwnerId)

    await this.eventRepository.save(event)

    event.commit()

    return {
      actionId: randomUUID(),
    }
  }
}
