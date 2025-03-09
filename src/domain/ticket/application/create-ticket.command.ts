import {EventTypeEnum} from '@domain/events/domain/entities/event-type.enum'
import {EventEntity} from '@domain/events/domain/entities/event.entity'
import {TicketCreatedEvent} from '@domain/ticket/domain/events/ticket-created.event'
import {TicketEntity} from '@domain/ticket/domain/ticket.entity'
import {TicketStatusEnum} from '@domain/ticket/domain/ticket.status.enum'
import {BadRequestException} from '@nestjs/common'
import {Command, CommandHandler, EventPublisher, ICommandHandler} from '@nestjs/cqrs'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

export class CreateTicketCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly eventId: string,
  ) {
    super()
  }
}

@CommandHandler(CreateTicketCommand)
export class CreateTicketCommandHandler implements ICommandHandler<CreateTicketCommand> {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,

    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ eventId, userId }: CreateTicketCommand) {
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

    const ticket = this.eventPublisher.mergeObjectContext(
      this.ticketRepository.create({
        userId,
        eventId: existsEvent.id,
        status: TicketStatusEnum.PENDING,
      }),
    )

    if (existsEvent.type === EventTypeEnum.FREE) {
      ticket.aprove()
    } else {
      ticket.apply(new TicketCreatedEvent(ticket))
    }

    await this.ticketRepository.save(ticket)

    ticket.commit()
  }
}
