import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HashProvider } from "../contracts/hash.provider";
import { UserEntity } from "../users.entity";

export class CreateUserCommand {
  constructor(public payload: { email: string; password: string; firstName: string; lastName: string }) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventPublisher: EventPublisher,
    private readonly hashProvider: HashProvider
  ) {}

  async execute({ payload }: CreateUserCommand) {
    const userExists = await this.userRepository.findOne({ where: { email: payload.email } });

    if (userExists) {
      throw new Error("User already exists");
    }

    const passwordHash = await this.hashProvider.hash(payload.password);

    const newUser = this.eventPublisher.mergeObjectContext(
      this.userRepository.create({
        email: payload.email,
        passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
      })
    );

    await this.userRepository.save(newUser);

    newUser.commit();
  }
}
