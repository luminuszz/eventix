import { PaymentConfirmedEvent } from '@domain/payment/domain/payment-confirmed.event'
import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { TicketApprovedEvent } from '@domain/ticket/domain/ticket-approved.event'
import { NotFoundException } from '@nestjs/common'
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@EventsHandler(PaymentConfirmedEvent)
export class ProcessPaymentEventHandler
  implements IEventHandler<PaymentConfirmedEvent>
{
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly payments: Repository<PaymentEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async handle({ ticketId, paymentId }: PaymentConfirmedEvent) {
    const payment = await this.payments.findOne({
      where: {
        id: paymentId,
      },
      relations: {
        ticket: true,
      },
    })

    if (!payment) {
      throw new NotFoundException('Payment does not exist')
    }

    const paymentModel = this.publisher.mergeObjectContext(payment)

    paymentModel.status = PaymentStatus.PAID

    await this.payments.save(payment)

    paymentModel.apply(new TicketApprovedEvent(ticketId, payment.userId))
    paymentModel.commit()
  }
}
