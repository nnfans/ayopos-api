import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto';
import {
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const logger = new Logger('UserRepository');

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async registerUser(userDto: CreateUserDto): Promise<UserEntity> {
    // check uniqueness of username/email
    const { email, name, password } = userDto;

    // create new user
    const user = new UserEntity();
    user.email = email;
    user.name = name;
    user.password = await this.hashPassword(password, await bcrypt.genSalt());

    const createdUser = await this.save(user).catch(error => {
      // Error code duplicate in MSSQL 2627
      if (error.number == 2627) {
        throw new ConflictException('Email already registered');
      }
      // Error code duplicate in PostgreSQL 23505
      if (error.code == 23505) {
        throw new ConflictException('Email already registered');
      }

      logger.error(error);
      throw new InternalServerErrorException();
    });

    return createdUser;
  }

  async findById(id: number): Promise<UserEntity> {
    return this.findOne(id);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ email });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
