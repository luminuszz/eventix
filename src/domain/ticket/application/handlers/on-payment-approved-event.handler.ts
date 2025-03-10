import { PaymentConfirmedEvent } from '@domain/payment/domain/payment-confirmed.event'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { Logger } from '@nestjs/common'
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@EventsHandler(PaymentConfirmedEvent)
export class OnPaymentApprovedEventHandler implements IEventHandler<PaymentConfirmedEvent> {
  private logger = new Logger(OnPaymentApprovedEventHandler.name)

  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async handle({ payment }: PaymentConfirmedEvent) {
    const ticket = this.publisher.mergeObjectContext(
      await this.ticketRepository.findOneOrFail({
        where: { id: payment.ticketId },
      }),
    )
    ticket.aprove()

    await this.ticketRepository.save(ticket)

    ticket.commit()
  }
}
