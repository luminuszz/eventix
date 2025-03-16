import { TicketStatusEnum } from '@domain/ticket/domain/ticket.status.enum'
import { UserEntity } from '@domain/users/domain/users.entity'
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class FetchEventParticipantsQuery extends Query<{
  participants: UserEntity[]
}> {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
  ) {
    super()
  }
}

@QueryHandler(FetchEventParticipantsQuery)
export class FetchEventParticipantsQueryHandler
  implements IQueryHandler<FetchEventParticipantsQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: FetchEventParticipantsQuery) {
    const results = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.tickets', 'ticket', 'ticket.eventId = :eventId', {
        eventId: query.eventId,
      })
      .where('ticket.status IN (:...status)', {
        status: [TicketStatusEnum.CHECKED_IN, TicketStatusEnum.CONFIRMED, TicketStatusEnum.PENDING],
      })
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'ticket.id',
        'ticket.status',
      ])

      .getMany()

    return {
      participants: results,
    }
  }
}
