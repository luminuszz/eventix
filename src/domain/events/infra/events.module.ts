import { CreateEventCommandHandler } from '@domain/events/application/commands/create-event.command'
import { RegisterEventAddressCommandHandler } from '@domain/events/application/commands/register-event-address.command'
import { TransferEventOwnerShipCommandHandler } from '@domain/events/application/commands/transfer-event-owner-ship.command'
import { UpdateEventAddressCommandHandler } from '@domain/events/application/commands/update-event-address.command'
import { UpdateEventDetailsCommandHandler } from '@domain/events/application/commands/update-event-details.command'
import { UpdateEventPriceCommandHandler } from '@domain/events/application/commands/update-event-price.command'
import { QueryHandlers } from '@domain/events/application/queries'
import { EventAddressEntity } from '@domain/events/domain/entities/event-address.entity'
import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { EventController } from '@domain/events/infra/http/events.controller'
import { UserEntity } from '@domain/users/domain/users.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity, EventAddressEntity])],
  providers: [
    ...QueryHandlers,
    CreateEventCommandHandler,
    UpdateEventDetailsCommandHandler,
    UpdateEventPriceCommandHandler,
    UpdateEventAddressCommandHandler,
    RegisterEventAddressCommandHandler,
    TransferEventOwnerShipCommandHandler,
  ],
  controllers: [EventController],
})
export class EventsModule {}
