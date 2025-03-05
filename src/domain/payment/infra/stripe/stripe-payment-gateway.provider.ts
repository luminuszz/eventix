import { PaymentGateway } from '@domain/payment/application/contracts/payment-gateway'
import { EnvService } from '@infra/env/env.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class StripePaymentGatewayProvider implements PaymentGateway {
  private readonly stripe: Stripe
  private readonly priceId: string

  constructor(private readonly env: EnvService) {
    this.stripe = new Stripe(env.get('STRIPE_PRIVATE_API_KEY'))
    this.priceId = env.get('STRIPE_PRICE_ID')
  }

  async generatePaymentUrl(paymentId: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'BRL',
      payment_method_types: ['card', 'boleto'],
      client_reference_id: paymentId,
      line_items: [
        {
          price: this.priceId,
          quantity: 1,
          adjustable_quantity: {
            enabled: false,
          },
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    })

    if (!session.url) {
      throw new BadRequestException('Payment session URL not found')
    }

    return session.url
  }
}
