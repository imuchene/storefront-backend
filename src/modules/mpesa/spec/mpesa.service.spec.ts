import { Test, TestingModule } from '@nestjs/testing';
import { MpesaService } from '../mpesa.service';

describe('MpesaService', () => {
  let service: MpesaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MpesaService],
    }).compile();

    service = module.get<MpesaService>(MpesaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
