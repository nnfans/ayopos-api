import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { MyRedisService } from '../shared/myRedis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigService,
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('jwt'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MyRedisService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
