import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { MpesaProducer } from '../mpesa.producer';
import { QueueNames } from '../../../common/enums/queue-names.enum';

describe('Enqueuer Service', () => {
  let mpesaProducer: MpesaProducer;
  let mockQueue: any;

  beforeAll(async () => {
    mockQueue = {
      add: jest.fn().mockImplementation(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MpesaProducer,
        {
          provide: getQueueToken(QueueNames.Mpesa),
          useValue: mockQueue,
        },
      ],
    }).compile();

    mpesaProducer = module.get<MpesaProducer>(MpesaProducer);
  });

  describe('mock queue', () => {
    it('adds a job', async () => {
      await mpesaProducer.createLipaNaMpesaRequestViaProducer({
        amount: 10,
        phoneNumber: '0721000000',
      });

      expect(mockQueue.add).toBeCalledTimes(1);
    });
  });
});
