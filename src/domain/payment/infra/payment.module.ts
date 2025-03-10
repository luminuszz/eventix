import { GeneratePaymentCheckoutCommandHandler } from '@domain/payment/application/commands/generate-payment-checkout.command'
import { UpdatePaymentStatusCommandHandler } from '@domain/payment/application/commands/update-payment-status.command'
import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { OnEventCreatedEventHandler } from '@domain/payment/application/handlers/on-event-created-event.handler'
import { OnUserCreatedEventHandler } from '@domain/payment/application/handlers/on-user-created-event.handler'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { PaymentController } from '@domain/payment/infra/http/payment.controller'
import { StripePaymentGatewayProvider } from '@domain/payment/infra/stripe/stripe-payment-gateway.provider'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, UserEntity])],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripePaymentGatewayProvider,
    },
    OnEventCreatedEventHandler,
    OnUserCreatedEventHandler,
    StripePaymentGatewayProvider,
    GeneratePaymentCheckoutCommandHandler,
    UpdatePaymentStatusCommandHandler,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
