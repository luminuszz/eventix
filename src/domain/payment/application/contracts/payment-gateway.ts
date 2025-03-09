export interface CreateProductDto {
  price: number
  name: string
  id: string
}

export interface RegisterCostumerDto {
  email: string
  name: string
  id: string
}

export interface GenerateProductPaymentUrlDto {
  paymentId: string
  eventId: string
  userEmail: string
}

export abstract class PaymentGateway {
  abstract generateByProductPaymentUrl(dto: GenerateProductPaymentUrlDto): Promise<string>
  abstract createProduct(dto: CreateProductDto): Promise<void>
  abstract registerCostumer(dto: RegisterCostumerDto): Promise<void>
}
