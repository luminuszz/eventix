import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { BadRequestException } from '@nestjs/common'
import { Command, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class MakeCheckInCommand extends Command<void> {
  constructor(
    public readonly ticketId: string,
    public readonly userId: string,
  ) {
    super()
  }
}

@CommandHandler(MakeCheckInCommand)
export class MakeCheckInCommandHandler implements ICommandHandler<MakeCheckInCommand> {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private publisher: EventPublisher,
  ) {}

  async execute({ userId, ticketId }: MakeCheckInCommand): Promise<void> {
    const ticket = await this.ticketRepository.findOne({
      where: {
        id: ticketId,
      },
      relations: {
        event: true,
      },
    })

    if (!ticket) throw new BadRequestException('Ticket not found')

    const userIsEventOwner = ticket.event.ownerId === userId

    const userCanMakeCheckIn = userIsEventOwner && ticket.isConfirmed

    if (!userCanMakeCheckIn) throw new BadRequestException('Invalid ticket operation')

    const ticketModel = this.publisher.mergeObjectContext(ticket)

    ticketModel.checkIn()

    await this.ticketRepository.save(ticket)

    ticketModel.commit()
  }
}
