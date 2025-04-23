import { AddressDto } from '@domain/events/application/commands/register-event-address.command'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { EventAddressUpdatedEvent } from '@domain/events/domain/events/event-address-updated.event'
import { Command, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class UpdateEventAddressCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly eventId: string,
    public readonly address: Partial<AddressDto>,
  ) {
    super()
  }
}

@CommandHandler(UpdateEventAddressCommand)
export class UpdateEventAddressCommandHandler
  implements ICommandHandler<UpdateEventAddressCommand>
{
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ eventId, address, userId }: UpdateEventAddressCommand): Promise<void> {
    const existsEvents = this.publisher.mergeObjectContext(
      await this.eventRepository.findOneOrFail({
        where: {
          id: eventId,
          ownerId: userId,
        },
        relations: {
          address: true,
        },
      }),
    )

    existsEvents.address.city = address?.city ?? existsEvents.address.city
    existsEvents.address.street = address?.street ?? existsEvents.address.street
    existsEvents.address.zipCode = address?.zipCode ?? existsEvents.address.zipCode
    existsEvents.address.country = address?.country ?? existsEvents.address.country

    if (existsEvents.address.isChanged) {
      existsEvents.apply(new EventAddressUpdatedEvent(existsEvents.address))
    }

    await this.eventRepository.save(existsEvents)

    existsEvents.commit()
  }
}
