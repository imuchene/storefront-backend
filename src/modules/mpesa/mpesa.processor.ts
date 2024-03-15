import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { MpesaService } from './mpesa.service';
import { Job } from 'bull';
import { LipaNaMpesaParams } from './interfaces/lipa-na-mpesa-params.interface';
import * as util from 'util';
import { Logger } from '@nestjs/common';
import { QueueNames } from '../../common/enums/queue-names.enum';
import { QueueJobNames } from '../../common/enums/queue-job-names.enum';

@Processor(QueueNames.Mpesa)
export class MpesaProcessor {
  private readonly logger = new Logger(MpesaProcessor.name);

  constructor(private readonly mpesaService: MpesaService) {}

  @Process({ name: QueueJobNames.LipaNaMpesaTransaction })
  async processLipaNaMpesaTransaction(job: Job) {
    try {
      const data: LipaNaMpesaParams = job.data;
      return await this.mpesaService.createLipaNaMpesaRequest(data);
    } catch (error) {
      this.logger.error('Error occurred', error);
      throw new Error(error);
    }
  }

  @OnQueueActive({ name: QueueJobNames.LipaNaMpesaTransaction })
  async onMpesaActive(job: Job) {
    this.logger.log(
      `Attempting to post a lipa na mpesa request with data ${util.inspect(
        job.data,
      )}`,
    );
  }

  @OnQueueFailed({ name: QueueJobNames.LipaNaMpesaTransaction })
  async onMpesaFail(job: Job) {
    this.logger.log(
      `The lipa na mpesa request with data ${util.inspect(
        job.data,
      )} has failed`,
    );
  }

  @OnQueueCompleted({ name: QueueJobNames.LipaNaMpesaTransaction })
  async onMpesaCompleted(job: Job) {
    this.logger.log(
      `The lipa na mpesa payment request with data ${job.data} has been posted successfully.`,
    );
  }
}
