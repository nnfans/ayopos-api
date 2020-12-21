import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // User
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
