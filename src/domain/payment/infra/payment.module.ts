import { GeneratePaymentCheckoutCommandHandler } from '@domain/payment/application/commands/generate-payment-checkout.command'
import { UpdatePaymentStatusCommandHandler } from '@domain/payment/application/commands/update-payment-status.command'
import { ProcessPaymentConsumer } from '@domain/payment/application/consumers/process-payment.consumer'
import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { OnEventCreatedEventHandler } from '@domain/payment/application/handlers/on-event-created-event.handler'
import { OnEventPriceUpdatedEventHandler } from '@domain/payment/application/handlers/on-event-price-updated-event.handler'
import { OnEventUpdatedHandler } from '@domain/payment/application/handlers/on-event-updated.handler'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { PaymentController } from '@domain/payment/infra/http/payment.controller'
import { StripePaymentGatewayProvider } from '@domain/payment/infra/stripe/stripe-payment-gateway.provider'
import { UserEntity } from '@domain/users/domain/users.entity'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, UserEntity]),
    BullModule.registerQueue({
      name: 'payment',
    }),
  ],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripePaymentGatewayProvider,
    },
    OnEventCreatedEventHandler,

    StripePaymentGatewayProvider,
    GeneratePaymentCheckoutCommandHandler,
    UpdatePaymentStatusCommandHandler,
    ProcessPaymentConsumer,
    OnEventPriceUpdatedEventHandler,
    OnEventUpdatedHandler,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
