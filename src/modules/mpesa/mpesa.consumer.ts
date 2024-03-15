import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { MpesaService } from './mpesa.service';
import { ConfirmChannel } from 'amqplib';
import { QueueNames } from '../../common/enums/queue-names.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MpesaConsumer implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(MpesaConsumer.name, { timestamp: true });

  constructor(
    private readonly mpesaService: MpesaService,
    private readonly configService: ConfigService,
  ) {
    const connection = amqp.connect(
      this.configService.get<string>('RABBITMQ_URL'),
    );
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(QueueNames.LipaNaMpesaQueue, {
          durable: true,
          exclusive: false,
        });
        await channel.consume(QueueNames.LipaNaMpesaQueue, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            await this.mpesaService.createLipaNaMpesaRequest(content);
            channel.ack(message);
            this.logger.log(
              'The consumer service has processed the payment request',
            );
          }
        });
      });
    } catch (error) {
      this.logger.error('Error starting the consumer', error);
    }
  }
}
