import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const testUser: UserEntity = new UserEntity();
testUser.id = 0;
testUser.email = 'test@example.com';
testUser.name = 'Test User';
testUser.password = 'Test Password';
testUser.isSuperUser = false;
testUser.passwordMustChange = false;

const mockUserRepository = () => ({
  registerUser: jest.fn(),
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
    it('It calls registerUser & return created userRO', async () => {
      const testUserDto: CreateUserDto = {
        email: testUser.email,
        name: testUser.name,
        password: testUser.password,
      };
      jest.spyOn(userRepository, 'registerUser').mockResolvedValue(testUser);

      const act = await userService.register(testUserDto);
      expect(userRepository.registerUser).toHaveBeenCalled();

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
});
