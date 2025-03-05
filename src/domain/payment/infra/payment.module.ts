import { EventEntity } from '@domain/events/entities/event.entity'

import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { GeneratePaymentCheckoutCommandHandler } from '@domain/payment/application/generate-payment-checkout.command'
import { ProcessPaymentEventHandler } from '@domain/payment/application/process-payment-event.handler'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { PaymentController } from '@domain/payment/infra/http/payment.controller'
import { StripePaymentGatewayProvider } from '@domain/payment/infra/stripe/stripe-payment-gateway.provider'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, PaymentEntity])],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripePaymentGatewayProvider,
    },
    GeneratePaymentCheckoutCommandHandler,
    ProcessPaymentEventHandler,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
