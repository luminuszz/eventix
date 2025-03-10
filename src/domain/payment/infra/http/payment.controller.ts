import { GeneratePaymentCheckoutCommand } from '@domain/payment/application/commands/generate-payment-checkout.command'
import { UpdatePaymentStatusCommand } from '@domain/payment/application/commands/update-payment-status.command'
import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { GeneratePaymentCheckoutDto } from '@domain/payment/infra/http/validators/generate-payment-checkout.dto'
import { StripePaymentGatewayProvider } from '@domain/payment/infra/stripe/stripe-payment-gateway.provider'
import { parseStripeCheckoutSessionSchema } from '@domain/payment/infra/stripe/stripe.schema'
import { IsPublic } from '@domain/users/infra/auth.guard'
import { User } from '@domain/users/infra/http/user-auth.decorator'
import { BadRequestException, Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { FastifyRequest } from 'fastify'

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly stripePaymentGateway: StripePaymentGatewayProvider,
  ) {}

  @Post('checkout')
  async postCheckout(@Body() dto: GeneratePaymentCheckoutDto, @User('id') userId: string) {
    const { paymentUrl } = await this.commandBus.execute(
      new GeneratePaymentCheckoutCommand(userId, dto.ticketId),
    )

    return {
      paymentUrl,
    }
  }

  @IsPublic()
  @Post('/stripe/webhook')
  async handlerStripeWebhooks(@Req() req: RawBodyRequest<FastifyRequest>) {
    if (!req.rawBody) throw new BadRequestException('Webhook error no raw body')

    const event = this.stripePaymentGateway.buildWebhookEvent(
      req.rawBody,
      req.headers['stripe-signature'] as string,
    )

    if (event.type === 'checkout.session.completed') {
      const { client_reference_id, status } = parseStripeCheckoutSessionSchema.parse(
        event.data.object,
      )

      if (status === 'complete') {
        await this.commandBus.execute(
          new UpdatePaymentStatusCommand(PaymentStatus.PAID, client_reference_id),
        )
      }
    }
  }
}
