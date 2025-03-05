import { GeneratePaymentCheckoutCommand } from '@domain/payment/application/generate-payment-checkout.command'
import { GeneratePaymentCheckoutDto } from '@domain/payment/infra/http/validators/generate-payment-checkout.dto'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

@Controller('payment')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('checkout')
  async postCheckout(
    @Body() dto: GeneratePaymentCheckoutDto,
    @User('id') userId: string,
  ) {
    const { paymentUrl } = await this.commandBus.execute(
      new GeneratePaymentCheckoutCommand(userId, dto.ticketId),
    )

    return {
      paymentUrl,
    }
  }
}
