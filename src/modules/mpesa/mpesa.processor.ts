import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueEvent,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull';
import { MpesaService } from './mpesa.service';
import { Job } from 'bull';
import { LipaNaMpesaParams } from './interfaces/lipa-na-mpesa-params.interface';
import * as util from 'util';
import { Logger } from '@nestjs/common';

// todo use an enum for queue names
@Processor('mpesa')
export class MpesaProcessor {
  private readonly logger = new Logger(MpesaProcessor.name);

  constructor(private mpesaService: MpesaService) {}

  // todo use an enum for job names
  @Process({ name: 'processLipaNaMpesaTransaction' })
  async processLipaNaMpesaTransaction(job: Job) {
    this.logger.debug('start processing...');
    const data: LipaNaMpesaParams = job.data;
    return this.mpesaService.createLipaNaMpesaRequest(data);
  }

  @OnQueueActive({ name: 'processLipaNaMpesaTransaction' })
  async onMpesaActive(job: Job) {
    this.logger.log(
      `Attempting to post a lipa na mpesa request with data ${util.inspect(
        job.data,
      )}`,
    );
  }

  @OnQueueFailed({ name: 'processLipaNaMpesaTransaction' })
  async onMpesaFail(job: Job) {
    this.logger.log(
      `Attempting to post a lipa na mpesa request with data ${util.inspect(
        job.data,
      )}`,
    );
  }

  @OnQueueStalled({ name: 'processLipaNaMpesaTransaction' })
  async onMpesaStall(job: Job) {
    this.logger.log(
      `Attempting to post a lipa na mpesa request with data ${util.inspect(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted({ name: 'processLipaNaMpesaTransaction' })
  async onMpesaCompleted(job: Job) {
    this.logger.log(
      `The lipa na mpesa payment request with data ${job.data} has been posted successfully.`,
    );
  }
  
  @OnQueueEvent('active')
  async test(){
    this.logger.log('This is a test');
    }
  }
