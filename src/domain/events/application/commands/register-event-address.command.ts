import { randomUUID } from 'node:crypto'
import { EventAddressEntity } from '@domain/events/domain/entities/event-address.entity'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { DomainError } from '@domain/shared/domain.error'
import { Command, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export interface AddressDto {
  street: string
  city: string
  zipCode: string
  country: string
}

export class RegisterEventAddressCommand extends Command<{ actionId: string }> {
  constructor(
    public readonly userId: string,
    public readonly eventId: string,
    public readonly address: AddressDto,
  ) {
    super()
  }
}

@CommandHandler(RegisterEventAddressCommand)
export class RegisterEventAddressCommandHandler
  implements ICommandHandler<RegisterEventAddressCommand>
{
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({
    eventId,
    address,
    userId,
  }: RegisterEventAddressCommand): Promise<{ actionId: string }> {
    const event = this.publisher.mergeObjectContext(
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

    if (event.address) {
      throw new DomainError('address already exists')
    }

    const eventAddress = new EventAddressEntity()

    eventAddress.street = address.street
    eventAddress.city = address.city
    eventAddress.zipCode = address.zipCode
    eventAddress.country = address.country
    eventAddress.eventId = event.id

    event.address = eventAddress

    await this.eventRepository.save(event)

    event.commit()

    return {
      actionId: randomUUID(),
    }
  }
}
