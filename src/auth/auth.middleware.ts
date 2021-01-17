import {
  NestMiddleware,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { MyRedisService } from '../shared/myRedis.service';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: MyRedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeaders = req.headers.authorization;
    let user = null;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      // Get token from authentication header and remove the prefix "Bearer "
      const token = (authHeaders as string).split(' ')[1];

      // Try to decode and verify token
      let payload;
      try {
        payload = await this.jwtService.verifyAsync(token);
      } catch (err) {
        // Throw if token is expired / not valid
        throw new UnauthorizedException('Token expired');
      }

      // get cached user data
      const cacheValue = await this.redisService.get('user:' + payload.id);

      if (cacheValue) {
        // Decode cache data
        user = JSON.parse(cacheValue);
        // Add entity prototype to parsed user data
        Object.setPrototypeOf(user, Object.getPrototypeOf(new UserEntity()));
      } else {
        // Get user from db
        user = await this.userRepository.findById(payload.id);
        // Save user to cache
        this.redisService.set(
          'user:' + payload.id,
          JSON.stringify(user),
          'EX',
          3600,
        );
      }
    }
    req.user = user;
    next();
  }
}
