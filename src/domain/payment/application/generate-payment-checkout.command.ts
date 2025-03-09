import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { InvalidPaymentOperationError } from '@domain/payment/application/errors/invalid-payment-operation.error'
import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { UserEntity } from '@domain/users/domain/users.entity'
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
    const user = await this.usersRepository.findOneOrFail({ where: { id: userId } })

    let payment: PaymentEntity

    const existsPayment = await this.paymentRepository.findOne({
      where: { ticketId },
      relations: {
        ticket: true,
      },
    })

    if (!existsPayment) {
      const paymentModel = this.paymentRepository.create({
        ticketId,
        userId: user.id,
        status: PaymentStatus.PENDING,
      })

      await this.paymentRepository.save(paymentModel)

      const createdPayment = await this.paymentRepository.findOne({
        where: { id: paymentModel.id },
        relations: {
          ticket: true,
        },
      })

      if (!createdPayment) {
        throw new InvalidPaymentOperationError('Payment not found')
      }

      payment = createdPayment
    } else {
      if (existsPayment.status === PaymentStatus.PAID) {
        throw new InvalidPaymentOperationError('Payment already paid')
      }

      payment = existsPayment
    }

    const paymentUrl = await this.paymentGateway.generateByProductPaymentUrl({
      paymentId: payment.id,
      userEmail: user.email,
      eventId: payment.ticket.eventId,
    })

    return {
      paymentUrl,
    }
  }
}
