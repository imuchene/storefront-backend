import { Test, TestingModule } from '@nestjs/testing';
import { MpesaController } from '../mpesa.controller';

describe('MpesaController', () => {
  let controller: MpesaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MpesaController],
    }).compile();

    controller = module.get<MpesaController>(MpesaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
