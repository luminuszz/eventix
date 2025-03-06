import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { GeneratePaymentCheckoutCommandHandler } from '@domain/payment/application/generate-payment-checkout.command'
import { UpdatePaymentStatusCommandHandler } from '@domain/payment/application/update-payment-status.command'
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
    StripePaymentGatewayProvider,
    GeneratePaymentCheckoutCommandHandler,
    UpdatePaymentStatusCommandHandler,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
