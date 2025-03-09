import {InvalidEventOperationError} from '@domain/events/application/errors/invalid-event-operation.error'
import {InvalidPaymentOperationError} from '@domain/payment/application/errors/invalid-payment-operation.error'
import {BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor,} from '@nestjs/common'
import {catchError, Observable} from 'rxjs'
import {ZodError} from 'zod'

@Injectable()
export class ExceptionHandlerInterceptor implements NestInterceptor {
  private isZodError(error: unknown): error is ZodError {
    return (
      (error as ZodError).issues !== undefined &&
      (error as ZodError).issues.length > 0 &&
      (error as ZodError)?.name == 'ZodError'
    )
  }

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (error instanceof InvalidPaymentOperationError) {
          throw new BadRequestException(error.message)
        }
        if (error instanceof InvalidEventOperationError) {
          throw new BadRequestException(error.message)
        }

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
