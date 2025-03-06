import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { BadRequestException } from '@nestjs/common'
import {
  Command,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class UpdatePaymentStatusCommand extends Command<{ actionId: string }> {
  constructor(
    public readonly status: PaymentStatus,
    public readonly paymentId: string,
  ) {
    super()
  }
}

@CommandHandler(UpdatePaymentStatusCommand)
export class UpdatePaymentStatusCommandHandler
  implements ICommandHandler<UpdatePaymentStatusCommand>
{
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({
    paymentId,
    status,
  }: UpdatePaymentStatusCommand): Promise<{ actionId: string }> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: {
        ticket: true,
      },
    })

    if (!payment) {
      throw new BadRequestException(`Payment ID ${paymentId} not found`)
    }

    const paymentModel = this.publisher.mergeObjectContext(payment)

    if (status === 'paid') {
      paymentModel.markAsPaid()
    }

    await this.paymentRepository.save(paymentModel)

    paymentModel.commit()

    return {
      actionId: crypto.randomUUID(),
    }
  }
}
