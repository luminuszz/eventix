import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { UserEntity } from '@domain/users/domain/users.entity'
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
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute({ ticketId, userId }: GeneratePaymentCheckoutCommand): Promise<{
    paymentUrl: string
  }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const payment = this.paymentRepository.create({
      ticketId,
      userId: user.id,
      status: PaymentStatus.PENDING,
    })

    await this.paymentRepository.save(payment)

    const paymentUrl = await this.paymentGateway.generatePaymentUrl(
      payment.id,
      user.email,
    )

    return {
      paymentUrl,
    }
  }
}
