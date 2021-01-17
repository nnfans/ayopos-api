import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const testUser: UserEntity = new UserEntity();
testUser.id = 1998;
testUser.email = 'test@example.com';
testUser.name = 'Test User';
testUser.password = 'Test Password';
testUser.isSuperUser = false;
testUser.passwordMustChange = false;

const mockUserRepository = () => ({
  registerUser: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('register() & private buildUserRO()', () => {
    it('Calls registerUser & return created userRO', async () => {
      const testUserDto: CreateUserDto = {
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
      };
      jest.spyOn(userRepository, 'registerUser').mockResolvedValue(testUser);

      const act = await userService.register(testUserDto);
      expect(userRepository.registerUser).toHaveBeenCalledWith(testUserDto);

      expect(act).toEqual({
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          isSuperUser: testUser.isSuperUser,
          passwordMustChange: testUser.passwordMustChange,
        },
      });
    });
  });

  describe('findById() & private buildUserRO()', () => {
    it('Calls findById & return matched userId userRO', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(testUser);

      const act = await userService.findById(testUser.id);

      expect(userRepository.findById).toHaveBeenCalledWith(testUser.id);

      expect(act).toEqual({
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          isSuperUser: testUser.isSuperUser,
          passwordMustChange: testUser.passwordMustChange,
        },
      });
    });

    it('Throw error as user id not found', async () => {
      const nonexistsId = 0;
      jest.spyOn(userRepository, 'findById').mockResolvedValue(undefined);

      expect(userService.findById(nonexistsId)).rejects.toThrow(
        NotFoundException,
      );

      expect(userRepository.findById).toHaveBeenCalledWith(testUser.id);
    });
  });

  describe('isMailExists()', () => {
    it('Return true as mail is exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(testUser);

      const act = await userService.isMailExists(testUser.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(testUser.email);

      expect(act).toEqual(true);
    });
  });
});
