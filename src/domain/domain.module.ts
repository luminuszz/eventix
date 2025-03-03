import { EventsModule } from '@domain/events/events.module'
import { UsersModule } from '@domain/users/users.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [UsersModule, EventsModule],
})
export class DomainModule {}
