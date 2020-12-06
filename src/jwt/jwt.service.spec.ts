import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';
import { async } from 'rxjs';
import { decode } from 'punycode';

const PRIVATE_KEY = 'PRIVATE_KEY';

const USER_ID = 1;

const MOCK_TOKEN = 'MOCK_TOKEN';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => MOCK_TOKEN),
    verify: jest.fn(() => ({
      id: USER_ID,
    })),
  };
});

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: PRIVATE_KEY },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return signed token', () => {
      const token = service.sign(USER_ID);

      expect(jwt.sign).toHaveBeenCalledWith({ id: USER_ID }, PRIVATE_KEY);

      expect(typeof token).toEqual('string');
      expect(token).toEqual(MOCK_TOKEN);
    });
  });

  describe('verify', () => {
    it('should return the decoded', async () => {
      const decoded = await service.verify(MOCK_TOKEN);

      expect(jwt.verify).toHaveBeenCalledWith(MOCK_TOKEN, PRIVATE_KEY);

      expect(typeof decoded).toEqual('object');
      expect(decoded).toEqual({
        id: USER_ID,
      });
    });
  });
});
