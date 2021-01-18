import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';
import * as bcryptJs from 'bcryptjs';
import { BCRYPT_MODULE } from '../types';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), AuthModule],
  providers: [
    UserService,
    { provide: BCRYPT_MODULE, useFactory: () => bcryptJs },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
