import {
  CreateProductDto,
  GenerateProductPaymentUrlDto,
  PaymentGateway,
  RegisterCostumerDto,
} from '@domain/payment/application/contracts/payment-gateway'
import { EnvService } from '@infra/env/env.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class StripePaymentGatewayProvider implements PaymentGateway {
  private readonly stripe: Stripe

  constructor(private readonly env: EnvService) {
    this.stripe = new Stripe(env.get('STRIPE_PRIVATE_API_KEY'))
  }

  async createProduct(dto: CreateProductDto): Promise<void> {
    await this.stripe.products.create({
      name: dto.name,
      active: true,
      id: dto.id,
      default_price_data: {
        currency: 'BRL',
        unit_amount: dto.price,
      },
    })
  }

  public buildWebhookEvent(body: string | Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      this.env.get('STRIPE_WEBHOOK_SECRET'),
    )
  }

  async registerCostumer(dto: RegisterCostumerDto): Promise<void> {
    await this.stripe.customers.create({
      name: dto.name,
      email: dto.email,
      metadata: {
        userid: dto.id,
      },
    })
  }
  async generatePaymentUrlByProduct({
    paymentId,
    userEmail,
    eventId,
  }: GenerateProductPaymentUrlDto): Promise<string> {
    const product = await this.stripe.products.retrieve(eventId)

    if (!product) {
      throw new BadRequestException('Stripe error: Product not found')
    }

    const { data: customerList } = await this.stripe.customers.list({
      email: userEmail,
    })

    const customer = customerList.find((item) => item.email === userEmail)

    if (!customer) {
      throw new BadRequestException('Stripe error: Customer not found')
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      currency: 'BRL',
      payment_method_types: ['card'],
      client_reference_id: paymentId,
      line_items: [
        {
          price: product.default_price as string,
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
