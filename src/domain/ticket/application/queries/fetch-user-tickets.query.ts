import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { TicketStatusEnum } from '@domain/ticket/domain/ticket.status.enum'
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class FetchUserTicketsQuery extends Query<{
  tickets: TicketEntity[]
  page: number
  totalOfPages: number
}> {
  constructor(
    public readonly userId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {
    super()
  }
}

@QueryHandler(FetchUserTicketsQuery)
export class FetchUserTicketsQueryHandler implements IQueryHandler<FetchUserTicketsQuery> {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
  ) {}

  async execute({ userId, page, limit }: FetchUserTicketsQuery): Promise<{
    tickets: TicketEntity[]
    page: number
    totalOfPages: number
  }> {
    const paginatedTickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select(['ticket.id', 'ticket.createdAt', 'event.name', 'event.description', 'ticket.status'])
      .leftJoinAndSelect('ticket.event', 'event')
      .where('ticket.userId = :userId', { userId })
      .where('ticket.status IN (:...status)', {
        status: [TicketStatusEnum.CHECKED_IN, TicketStatusEnum.CONFIRMED, TicketStatusEnum.PENDING],
      })
      .skip(page * limit)
      .take(limit)
      .getMany()

    const count = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.userId = :userId', { userId })
      .where('ticket.status IN (:...status)', {
        status: [TicketStatusEnum.CHECKED_IN, TicketStatusEnum.CONFIRMED, TicketStatusEnum.PENDING],
      })
      .getCount()

    const totalOfPages = Math.ceil(count / limit)

    return {
      page,
      tickets: paginatedTickets,
      totalOfPages,
    }
  }
}
