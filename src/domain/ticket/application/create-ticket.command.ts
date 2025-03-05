import { EventEntity } from '@domain/events/entities/event.entity'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { UserEntity } from '@domain/users/domain/users.entity'
import { BadRequestException } from '@nestjs/common'
import {
  Command,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class CreateTicketCommand extends Command<{ ticketId: string }> {
  constructor(
    public readonly userId: string,
    public readonly eventId: string,
  ) {
    super()
  }
}

@CommandHandler(CreateTicketCommand)
export class CreateTicketCommandHandler
  implements ICommandHandler<CreateTicketCommand>
{
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    eventId,
    userId,
  }: CreateTicketCommand): Promise<{ ticketId: string }> {
    const existsEvent = await this.eventRepository.findOne({
      where: { id: eventId },
    })

    if (!existsEvent) {
      throw new BadRequestException('Event not found')
    }

    const allTicketsByEventCount = await this.ticketRepository.count({
      where: {
        eventId: existsEvent.id,
      },
    })

    const hasCapacity = allTicketsByEventCount < existsEvent.maxCapacity

    if (!hasCapacity) {
      throw new BadRequestException('Event is full')
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const ticket = this.eventPublisher.mergeObjectContext(
      this.ticketRepository.create({
        eventId: existsEvent.id,
        userId: user.id,
      }),
    )

    await this.ticketRepository.save(ticket)

    return {
      ticketId: ticket.id,
    }
  }
}
