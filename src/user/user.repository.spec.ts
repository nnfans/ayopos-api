import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BCRYPT_MODULE } from '../types';
import { CreateUserDto } from './dto';
import { UserRepository } from './user.repository';

const mockBcryptJs = {
  hash: jest.fn(),
  genSalt: jest.fn(),
};

const mockWinston = {
  error: jest.fn(),
};

const testUser = {
  id: 1998,
  email: 'test@example.com',
  name: 'Test User',
  password: 'Test Password',
  isSuperUser: false,
  passwordMustChange: false,
};

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [WinstonModule],
      providers: [
        UserRepository,
        { provide: BCRYPT_MODULE, useFactory: () => mockBcryptJs },
        { provide: WINSTON_MODULE_PROVIDER, useFactory: () => mockWinston },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('registerUser()', () => {
    const create = jest.fn();
    const save = jest.fn();

    beforeEach(() => {
      // Mock userRepository functions
      userRepository.create = create.mockReturnValue({});
      userRepository.save = save;
      mockBcryptJs.hash.mockResolvedValue('hashPassword');
      mockBcryptJs.genSalt.mockResolvedValue('Salty');
    });

    it('successfully register user & return registered user object', async () => {
      const testUserDto: CreateUserDto = {
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
      };

      save.mockResolvedValue('user');

      const act = await userRepository.registerUser(testUserDto);

      expect(create).toHaveBeenCalledWith();
      expect(mockBcryptJs.genSalt).toHaveBeenCalledWith();
      expect(mockBcryptJs.hash).toHaveBeenCalledWith(
        testUser.password,
        expect.any(String),
      );
      expect(save).toHaveBeenCalledWith({
        ...testUserDto,
        password: 'hashPassword',
      });

      expect(act).toEqual('user');
    });

    it('throw ConflictException as email is duplicate', () => {
      const testUserDto: CreateUserDto = {
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
      };

      // MSSQL error object for constraint duplicate
      save.mockImplementation(async () => {
        throw { number: 2627 };
      });
      expect(userRepository.registerUser(testUserDto)).rejects.toThrow(
        ConflictException,
      );
      // As string
      save.mockImplementation(async () => {
        throw { number: '2627' };
      });
      expect(userRepository.registerUser(testUserDto)).rejects.toThrow(
        ConflictException,
      );

      // Postgres error object for constraint duplicate
      save.mockImplementation(async () => {
        throw { code: 23505 };
      });
      expect(userRepository.registerUser(testUserDto)).rejects.toThrow(
        ConflictException,
      );
      // As string
      save.mockImplementation(async () => {
        throw { code: '23505' };
      });
      expect(userRepository.registerUser(testUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('log error & throw InternalServerErrorException', async () => {
      const testUserDto: CreateUserDto = {
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
      };

      save.mockImplementation(async () => {
        throw undefined;
      });
      await expect(userRepository.registerUser(testUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockWinston.error).toHaveBeenCalledWith(undefined);
    });
  });
});
