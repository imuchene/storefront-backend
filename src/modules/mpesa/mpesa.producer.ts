import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { BackoffOptions, JobOptions, Queue } from 'bull';
import { LipaNaMpesaParams } from './interfaces/lipa-na-mpesa-params.interface';
import { QueueNames } from '../../common/enums/queue-names.enum';
import { QueueJobNames } from '../../common/enums/queue-job-names.enum';

@Injectable()
export class MpesaProducer {
  constructor(
    @InjectQueue(QueueNames.Mpesa)
    private readonly mpesaQueue: Queue,
  ) {}

  async createLipaNaMpesaRequestViaProducer(
    lipaNaMpesaParams: LipaNaMpesaParams,
  ): Promise<any> {
    const backOffOptions: BackoffOptions = {
      type: 'fixed',
      delay: 3 * 1000,
    };

    const jobOptions: JobOptions = {
      attempts: 5,
      backoff: backOffOptions,
      timeout: 30 * 1000,
    };

    const job = await this.mpesaQueue.add(
      QueueJobNames.LipaNaMpesaTransaction,
      lipaNaMpesaParams,
      jobOptions,
    );
    
    return job;
  }
}
