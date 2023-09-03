import { Test, TestingModule } from '@nestjs/testing';
import { MyredisService } from './myredis.service';

describe('MyredisService', () => {
  let service: MyredisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyredisService],
    }).compile();

    service = module.get<MyredisService>(MyredisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
