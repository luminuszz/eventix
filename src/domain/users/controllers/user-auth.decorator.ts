import { JwtPayload } from '@infra/utils/jwt'
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) =>
    data
      ? ctx.switchToHttp().getRequest().user[data]
      : ctx.switchToHttp().getRequest().user,
)
