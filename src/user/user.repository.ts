import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto';
import {
  InternalServerErrorException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { BcryptJs, BCRYPT_MODULE } from '../types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @Inject(BCRYPT_MODULE) private readonly bcryptJs: BcryptJs,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }

  async registerUser(userDto: CreateUserDto): Promise<UserEntity> {
    // check uniqueness of username/email
    const { email, name, password } = userDto;

    // create new user
    const user = this.create();
    user.email = email;
    user.name = name;
    user.password = await this.bcryptJs.hash(
      password,
      await this.bcryptJs.genSalt(),
    );

    const createdUser = await this.save(user).catch(error => {
      if (typeof error === 'object') {
        // Error code duplicate
        // MSSQL number: 2627
        // PostgreSQL code: 23505
        if (error.number == 2627 || error.code == 23505) {
          throw new ConflictException('Email already registered');
        }
      }

      this.logger.error(error);
      throw new InternalServerErrorException();
    });

    return createdUser;
  }
}
