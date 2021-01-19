import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: AuthCredentialsDto): Promise<string> {
    const user = await this.userRepository.findOne({ email });

    const auth = user && (await user.validatePassword(password));
    if (!auth) {
      throw new UnauthorizedException(`Email and password doesn't match`);
    }

    return this.generateJWT(user);
  }

  generateJWT(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
  }
}
