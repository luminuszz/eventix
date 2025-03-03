import { UserEntity } from '@domain/users/users.entity'
import { JwtPayload } from '@infra/utils/jwt'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

const IS_PUBLIC_METADATA_KEY = 'isPublic'

export const WithAuth = () => UseGuards(AuthGuard)

export const IsPublic = () => SetMetadata(IS_PUBLIC_METADATA_KEY, true)

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly reflector: Reflector,
  ) {}

  private context: ExecutionContext

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.context = context

    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_METADATA_KEY,
      [context.getClass(), context.getHandler()],
    )

    if (isPublicRoute) return true

    const jwtToken = this.extractTokenFormRequest()

    if (!jwtToken) {
      throw new UnauthorizedException()
    }

    await this.validateUserToken(jwtToken)

    return true
  }

  private extractTokenFormRequest(): string | undefined {
    const request = this.context.switchToHttp().getRequest()

    if (!request.headers['authorization']) {
      throw new UnauthorizedException()
    }

    return request.headers?.authorization?.split(' ')[1]
  }

  private injectDecodedPayloadOnRequest(decodedPayload: JwtPayload) {
    this.context.switchToHttp().getRequest()['user'] = {
      email: decodedPayload.email,
      name: decodedPayload.name,
      id: decodedPayload.id,
    } satisfies JwtPayload
  }

  private async validateUserToken(token: string) {
    const decodedToken = await this.jwtService.verifyAsync<JwtPayload>(token)

    const user = await this.usersRepository.findOne({
      where: { id: decodedToken.id },
    })

    if (!user) throw new UnauthorizedException()

    this.injectDecodedPayloadOnRequest({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      id: user.id,
    })
  }
}
