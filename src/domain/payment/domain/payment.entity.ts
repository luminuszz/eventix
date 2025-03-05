import { PaymentStatus } from '@domain/payment/domain/payment-status.enum'
import { DomainEntity } from '@domain/shared/domain.entity'
import { TicketEntity } from '@domain/ticket/domain/ticket.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity('payments')
export class PaymentEntity extends DomainEntity {
  @Column({ enum: PaymentStatus, type: 'enum', name: 'status' })
  status: PaymentStatus

  @Column()
  ticketId: string

  @Column()
  userId: string

  @ManyToOne(() => TicketEntity)
  ticket: TicketEntity
}
