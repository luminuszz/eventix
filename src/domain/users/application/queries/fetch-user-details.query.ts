import { UserEntity } from '@domain/users/domain/users.entity'
import { Logger } from '@nestjs/common'
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class FetchUserDetailsQuery extends Query<{
  user: UserEntity
}> {
  constructor(public readonly userId: string) {
    super()
  }
}

@QueryHandler(FetchUserDetailsQuery)
export class FetchUserDetailsQueryHandler implements IQueryHandler<FetchUserDetailsQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private logger = new Logger(FetchUserDetailsQuery.name)

  async execute({ userId }: FetchUserDetailsQuery): Promise<{ user: UserEntity }> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tickets', 'ticket')
      .leftJoinAndSelect('ticket.event', 'event')
      .where('user.id = :id', { id: userId })
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'ticket.id',
        'ticket.eventId',
        'ticket.status',
        'event.name',
        'event.description',
      ])
      .getOneOrFail()

    this.logger.debug(user)

    return {
      user,
    }
  }
}
