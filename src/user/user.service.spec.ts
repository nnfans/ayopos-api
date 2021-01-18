import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { UserRO } from './user.interface';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const testUser: UserEntity = new UserEntity();
testUser.id = 1998;
testUser.email = 'test@example.com';
testUser.name = 'Test User';
testUser.password = 'Test Password';
testUser.isSuperUser = false;
testUser.passwordMustChange = false;

const testUserRO: UserRO = {
  user: {
    id: testUser.id,
    email: testUser.email,
    name: testUser.name,
    isSuperUser: testUser.isSuperUser,
    passwordMustChange: testUser.passwordMustChange,
  },
};

const mockUserRepository = {
  registerUser: jest.fn(),
  findOne: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useFactory: () => mockUserRepository },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('register()', () => {
    it('Calls registerUser', async () => {
      const testUserDto: CreateUserDto = {
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
      };
      mockUserRepository.registerUser.mockResolvedValue('registeredUser');
      jest.spyOn(userService, 'buildUserRO').mockReturnValue(testUserRO);

      const act = await userService.register(testUserDto);
      expect(userRepository.registerUser).toHaveBeenCalledWith(testUserDto);
      expect(userService.buildUserRO).toHaveBeenCalledWith('registeredUser');

      expect(act).toEqual(testUserRO);
    });
  });

  describe('findById()', () => {
    it('Calls findById', async () => {
      mockUserRepository.findOne.mockResolvedValue(testUser);

      const act = await userService.findById(testUser.id);

      expect(userRepository.findOne).toHaveBeenCalledWith(testUser.id);

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

    it('Throw NotFoundException as user id not found', async () => {
      const nonexistsId = 0;
      mockUserRepository.findOne.mockResolvedValue(undefined);

      expect(userService.findById(nonexistsId)).rejects.toThrow(
        NotFoundException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith(nonexistsId);
    });
  });

  describe('isMailExists()', () => {
    it('Return true as mail is exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(testUser);

      const act = await userService.isMailExists(testUser.email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: testUser.email,
      });

      expect(act).toEqual(true);
    });
  });
});
