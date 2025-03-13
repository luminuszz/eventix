import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class FetchEventsQuery {}

@QueryHandler(FetchEventsQuery)
export class FetchEventsQueryHandler implements IQueryHandler<FetchEventsQuery> {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async execute() {
    return await this.eventRepository.find({})
  }
}
