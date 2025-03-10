import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { Command, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
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

  async execute({ paymentId, status }: UpdatePaymentStatusCommand): Promise<{ actionId: string }> {
    const payment = this.publisher.mergeObjectContext(
      await this.paymentRepository.findOneOrFail({
        where: { id: paymentId },
        relations: {
          ticket: true,
        },
      }),
    )

    if (status === 'paid') {
      payment.confirm()
    }

    await this.paymentRepository.save(payment)

    payment.commit()

    return {
      actionId: crypto.randomUUID(),
    }
  }
}
