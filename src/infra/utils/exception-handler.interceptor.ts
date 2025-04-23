import { InvalidEventOperationError } from '@domain/events/application/errors/invalid-event-operation.error'
import { InvalidPaymentOperationError } from '@domain/payment/application/errors/invalid-payment-operation.error'
import { DomainError } from '@domain/shared/domain.error'
import { InvalidUserOperationError } from '@domain/users/application/errors/invalid-user-operation.error'
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, catchError } from 'rxjs'
import { EntityNotFoundError } from 'typeorm'
import { ZodError } from 'zod'

@Injectable()
export class ExceptionHandlerInterceptor implements NestInterceptor {
  private isZodError(error: unknown): error is ZodError {
    return (
      (error as ZodError).issues !== undefined &&
      (error as ZodError).issues.length > 0 &&
      (error as ZodError)?.name == 'ZodError'
    )
  }

  private domainErrors = [
    InvalidPaymentOperationError,
    InvalidEventOperationError,
    InvalidUserOperationError,
    InvalidUserOperationError,
    DomainError,
    EntityNotFoundError,
  ]

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        // application errors
        if (this.domainErrors.some((err) => error instanceof err)) {
          throw new BadRequestException(error)
        }

        // validations errors [zod,  pipes e etc...]
        if (this.isZodError(error)) {
          throw new BadRequestException({
            message: 'Validation error',
            errors: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
          })
        }

        throw error
      }),
    )
  }
}
