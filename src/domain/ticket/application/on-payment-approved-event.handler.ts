import { PaymentConfirmedEvent } from '@domain/payment/domain/payment-confirmed.event'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { Logger } from '@nestjs/common'
import {
  EventPublisher,
  EventsHandler,
  IEventHandler,
  InvalidEventsHandlerException,
} from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@EventsHandler(PaymentConfirmedEvent)
export class OnPaymentApprovedEventHandler
  implements IEventHandler<PaymentConfirmedEvent>
{
  private logger = new Logger(OnPaymentApprovedEventHandler.name)

  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async handle({ payment }: PaymentConfirmedEvent) {
    this.logger.log('Handling event: PaymentConfirmedEvent')

    const ticket = await this.ticketRepository.findOne({
      where: { id: payment.ticketId },
    })

    if (!ticket) {
      throw new InvalidEventsHandlerException()
    }

    const ticketModel = this.publisher.mergeObjectContext(ticket)

    ticketModel.aprove()

    await this.ticketRepository.save(ticket)

    ticketModel.commit()
  }
}
