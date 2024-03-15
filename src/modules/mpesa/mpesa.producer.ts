import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { LipaNaMpesa } from './interfaces/lipa-na-mpesa.interface';
import { QueueNames } from '../../common/enums/queue-names.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MpesaProducer {
  private channelWrapper: ChannelWrapper;
  private logger = new Logger(MpesaProducer.name, { timestamp: true });

  constructor(private readonly configService: ConfigService) {
    const connection = amqp.connect(
      this.configService.get<string>('RABBITMQ_URL'),
    );
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue(QueueNames.LipaNaMpesaQueue, {
          durable: true,
        });
      },
    });
  }

  async addLipaNaMpesaToQueue(request: LipaNaMpesa): Promise<boolean> {
    try {
      const queuedMessage = await this.channelWrapper.sendToQueue(
        QueueNames.LipaNaMpesaQueue,
        Buffer.from(JSON.stringify(request)),
        { persistent: true },
      );
      this.logger.log('Payment request sent to queue');
      return queuedMessage;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error adding the request to the queue',
      );
    }
  }
}
