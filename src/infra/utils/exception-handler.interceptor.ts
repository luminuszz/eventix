import { InvalidEventOperationError } from '@domain/events/application/errors/invalid-event-operation.error'
import { InvalidPaymentOperationError } from '@domain/payment/application/errors/invalid-payment-operation.error'
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

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        // application errors

        if (error instanceof InvalidPaymentOperationError) {
          throw new BadRequestException(error.message)
        }
        if (error instanceof InvalidEventOperationError) {
          throw new BadRequestException(error.message)
        }

        if (error instanceof InvalidUserOperationError) {
          throw new BadRequestException(error.message)
        }

        // database errors

        if (error instanceof EntityNotFoundError) {
          throw new BadRequestException('Not found entity')
        }

        // validations errors [http]

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
