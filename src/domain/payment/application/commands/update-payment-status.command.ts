import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { InjectQueue } from '@nestjs/bullmq'
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Queue } from 'bullmq'

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
    @InjectQueue('payment')
    private processPaymentQueue: Queue<UpdatePaymentStatusCommand>,
  ) {}

  async execute({ paymentId, status }: UpdatePaymentStatusCommand): Promise<{ actionId: string }> {
    await this.processPaymentQueue.add(
      'process-payment-status',
      new UpdatePaymentStatusCommand(status, paymentId),
    )

    return {
      actionId: crypto.randomUUID(),
    }
  }
}
