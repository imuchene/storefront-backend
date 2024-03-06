import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { BackoffOptions, JobOptions, Queue } from 'bull';
import { LipaNaMpesaParams } from './interfaces/lipa-na-mpesa-params.interface';

@Injectable()
export class MpesaProducer {
  constructor(
    // todo add enums for queue names
    @InjectQueue('mpesa')
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

    // todo add enums for job names
    const job = await this.mpesaQueue.add(
      'processLipaNaMpesaTransaction',
      lipaNaMpesaParams,
      jobOptions,
    );
    return job.data;
  }
}
