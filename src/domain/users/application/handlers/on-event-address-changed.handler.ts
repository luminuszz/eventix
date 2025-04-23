import { EventAddressUpdatedEvent } from '@domain/events/domain/events/event-address-updated.event'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { Logger } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

interface SendNotificationParams {
  eventName: string
  userEmail: string
  eventId: string
}

@EventsHandler(EventAddressUpdatedEvent)
export class OnEventAddressChangedHandler implements IEventHandler<EventAddressUpdatedEvent> {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  private logger = new Logger(OnEventAddressChangedHandler.name)

  private readonly batchSize = 100

  async handle({ address }: EventAddressUpdatedEvent) {
    const totalOfParticipants = await this.ticketRepository.count({
      where: {
        eventId: address.eventId,
      },
    })

    for await (const batch of this.getParticipantsBatch(address.eventId, totalOfParticipants)) {
      for (const ticket of batch) {
        await this.sendNotification({
          eventId: ticket.eventId,
          eventName: ticket.event.name,
          userEmail: ticket.user.email,
        })
      }
    }
  }

  private async *getParticipantsBatch(eventId: string, totalParticipants: number) {
    let count = 0

    while (count < totalParticipants) {
      const batch = await this.ticketRepository
        .createQueryBuilder('ticket')
        .innerJoinAndSelect('ticket.user', 'user')
        .innerJoinAndSelect('ticket.event', 'event')
        .where('ticket.eventId = :eventId', { eventId })
        .select(['user.id', 'user.email', 'event.name', 'event.id', 'event.name', 'ticket.id'])
        .skip(count)
        .take(this.batchSize)
        .getMany()

      count += batch.length
      yield batch
    }
  }

  private async sendNotification({ eventName, eventId, userEmail }: SendNotificationParams) {
    return Promise.reject(() => {
      this.logger.log(
        `Sending notification to ${userEmail} about address change in event ${eventName} (${eventId})`,
      )
    })
  }
}
