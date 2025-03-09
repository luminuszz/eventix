import {PaymentConfirmedEvent} from '@domain/payment/domain/payment-confirmed.event'
import {PaymentStatus} from '@domain/payment/domain/payment-status.enum'
import {DomainEntity} from '@domain/shared/domain.entity'
import {TicketEntity} from '@domain/ticket/domain/ticket.entity'
import {UserEntity} from '@domain/users/domain/users.entity'
import {Column, Entity, ManyToOne} from 'typeorm'

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

  @ManyToOne(() => UserEntity)
  user: UserEntity

  markAsPaid() {
    this.status = PaymentStatus.PAID
    this.apply(new PaymentConfirmedEvent(this))
  }
}
