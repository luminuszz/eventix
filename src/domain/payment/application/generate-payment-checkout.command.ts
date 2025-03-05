import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { BadRequestException } from '@nestjs/common'
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class GeneratePaymentCheckoutCommand extends Command<{
  paymentUrl: string
}> {
  constructor(
    public readonly userId: string,
    public readonly ticketId: string,
  ) {
    super()
  }
}

@CommandHandler(GeneratePaymentCheckoutCommand)
export class GeneratePaymentCheckoutCommandHandler
  implements ICommandHandler<GeneratePaymentCheckoutCommand>
{
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly payments: Repository<PaymentEntity>,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute({ ticketId, userId }: GeneratePaymentCheckoutCommand): Promise<{
    paymentUrl: string
  }> {
    const alreadyExistsPaymentForThisTicket = await this.payments.findOne({
      where: {
        ticketId,
      },
    })

    if (alreadyExistsPaymentForThisTicket) {
      throw new BadRequestException('Payment already exists for this ticket')
    }

    const payment = this.payments.create({
      ticketId,
      userId,
      status: PaymentStatus.PENDING,
    })

    await this.payments.save(payment)

    const paymentUrl = await this.paymentGateway.generatePaymentUrl(payment.id)

    payment.commit()

    return {
      paymentUrl,
    }
  }
}
