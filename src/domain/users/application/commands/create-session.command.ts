import { HashProvider } from '@domain/users/contracts/hash.provider'
import { UserEntity } from '@domain/users/domain/users.entity'
import { JwtPayload } from '@infra/utils/jwt'
import { BadRequestException } from '@nestjs/common'
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class CreateSessionCommand extends Command<{
  token: string
}> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super()
  }
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionCommandHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwt: JwtService,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute({ password, email }: CreateSessionCommand) {
    const user = await this.usersRepository.findOne({ where: { email } })

    if (!user) {
      throw new BadRequestException('user not found')
    }

    const passwordMatch = this.hashProvider.compare(password, user.passwordHash)

    if (!passwordMatch) {
      throw new BadRequestException('user not found')
    }

    const jwtDecodePayload = {
      email,
      name: user.email,
      id: user.id,
    } satisfies JwtPayload

    const token = await this.jwt.signAsync(jwtDecodePayload)

    return {
      token,
    }
  }
}
