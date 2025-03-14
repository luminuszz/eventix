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

export interface UpdateProductDetailsDto {
  eventId: string
  name?: string
  description?: string
}

export interface UpdateProductPriceDto {
  eventId: string
  price: number
}

export abstract class PaymentGateway {
  abstract generatePaymentUrlByProduct(dto: GenerateProductPaymentUrlDto): Promise<string>
  abstract createProduct(dto: CreateProductDto): Promise<void>
  abstract updateProductDetails(dto: UpdateProductDetailsDto): Promise<void>
  abstract updateProductPrice(dto: UpdateProductPriceDto): Promise<void>
}
