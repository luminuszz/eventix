import { UpdatePaymentStatusCommand } from '@domain/payment/application/commands/update-payment-status.command'
import { PaymentEntity } from '@domain/payment/domain/payment.entity'
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { EventPublisher } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bullmq'
import { Repository } from 'typeorm'

@Processor('payment')
export class ProcessPaymentConsumer extends WorkerHost {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly publisher: EventPublisher,
  ) {
    super()
  }

  private logger = new Logger(ProcessPaymentConsumer.name)

  async process(job: Job<UpdatePaymentStatusCommand>): Promise<void> {
    const { paymentId, status } = job.data

    switch (job.name) {
      case 'process-payment-status': {
        const payment = this.publisher.mergeObjectContext(
          await this.paymentRepository.findOneOrFail({
            where: { id: paymentId },
            relations: {
              ticket: true,
            },
          }),
        )

        if (status === 'paid') {
          payment.confirm()
        }

        await this.paymentRepository.save(payment)

        payment.commit()

        await job.updateProgress(100)
      }
    }
  }

  @OnWorkerEvent('completed')
  onWorkComplete(job: Job<UpdatePaymentStatusCommand>) {
    this.logger.log(`Job completed ${job.name}`)
  }

  @OnWorkerEvent('failed')
  onWorkFailed(job: Job<UpdatePaymentStatusCommand>) {
    this.logger.log(`Job failed ${job.name}  - ${job.id}`)
  }

  @OnWorkerEvent('active')
  onActive(job: Job<UpdatePaymentStatusCommand>) {
    this.logger.log(`Job ${job.id} is active`)
  }
}
