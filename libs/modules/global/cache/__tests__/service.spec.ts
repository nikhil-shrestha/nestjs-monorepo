import { Test } from '@nestjs/testing';
import * as Redis from 'redis';

import { ApiException, MockUtils } from '../../../../utils';
import { ICacheService } from '../adapter';
import { CacheService } from '../service';

describe('ICacheService', () => {
  let service: ICacheService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: ICacheService,
          useFactory: (env = 'mock') => new CacheService(env),
        },
      ],
    }).compile();

    service = app.get(ICacheService);
  });

  describe('connect', () => {
    test('should connect successfully', async () => {
      await expect(service.connect()).resolves.not.toBeUndefined();
    });
  });

  describe('get', () => {
    test('should get successfully', async () => {
      const mock = {
        get: () => true,
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));
      await expect(service.get(undefined)).resolves.toEqual(true);
    });
  });

  describe('set', () => {
    test('should set successfully', async () => {
      const mock = {
        set: () => Promise.resolve('OK'),
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));

      await expect(service.set(undefined, undefined)).resolves.toBeUndefined();
    });

    test('should set unsuccessfully', async () => {
      const mock = {
        set: () => Promise.resolve('NOK'),
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));

      await expect(service.set(undefined, undefined)).rejects.toThrowError(
        new ApiException('Cache key: undefined not set'),
      );
    });
  });

  describe('hGet', () => {
    test('should hGet successfully', async () => {
      const mock = {
        hGet: () => true,
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));

      await expect(service.hGet(undefined, undefined)).resolves.toEqual(true);
    });
  });

  describe('hGetAll', () => {
    test('should hGetAll successfully', async () => {
      const mock = {
        hGetAll: () => true,
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));
      await expect(service.hGetAll(undefined)).resolves.toEqual(true);
    });
  });

  describe('hSet', () => {
    test('should hSet successfully', async () => {
      const mock = {
        hSet: () => Promise.resolve(1),
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));

      await expect(service.hSet(undefined, undefined, undefined)).resolves.toBeUndefined();
    });

    test('should hSet unsuccessfully', async () => {
      const mock = {
        hSet: () => Promise.resolve(0),
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));

      await expect(service.hSet(undefined, undefined, undefined)).rejects.toThrowError(
        new ApiException('Cache key: undefined not set'),
      );
    });
  });

  describe('pExpire', () => {
    test('should pExpire successfully', async () => {
      const mock = {
        pExpire: () => Promise.resolve(true),
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));

      await expect(service.pExpire(undefined, undefined)).resolves.toBeUndefined();
    });

    test('should pExpire unsuccessfully', async () => {
      const mock = {
        pExpire: () => Promise.resolve(0),
        connect: jest.fn(),
      };

      jest.spyOn(Redis, 'createClient').mockImplementation(() => MockUtils.setMock(mock));

      await expect(service.pExpire(undefined, undefined)).rejects.toThrowError(
        new ApiException('undefined not set to expired'),
      );
    });
  });
});