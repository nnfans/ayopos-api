import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto';
import { UserRO } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async create(userDto: CreateUserDto): Promise<UserRO> {
    const user = await this.userRepository.registerUser(userDto);

    return this.buildUserRO(user);
  }

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return this.buildUserRO(user);
  }

  async isMailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);

    return !!user;
  }

  private buildUserRO({
    id,
    email,
    name,
    isSuperUser,
    passwordMustChange,
  }: UserEntity): UserRO {
    return {
      user: {
        id,
        email,
        name,
        isSuperUser,
        passwordMustChange,
      },
    };
  }
}
