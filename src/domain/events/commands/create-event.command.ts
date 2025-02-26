import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEntity } from "../entities/event.entity";

export class CreateEventCommand {
  constructor(
    public readonly name: string,
    public readonly description: string
  ) {}
}

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly publisher: EventPublisher
  ) {}

  async execute({ description, name }: CreateEventCommand) {
    const event = this.publisher.mergeObjectContext(this.eventRepository.create({ description, name }));

    await this.eventRepository.save(event);

    event.commit();
  }
}
