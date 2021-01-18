import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';

import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import dbConfig from './config/dbConfig';
import appConfig from './config/appConfig';
import jwtConfig from './config/jwtConfig';
import dbConfigTest from './config/dbConfigTest';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, dbConfigTest, jwtConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) =>
        config.get('app.env') === 'test'
          ? config.get('postgresTest')
          : config.get('postgres'),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        config.get('app.env') === 'test'
          ? config.get('redisTest')
          : config.get('redis'),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ProductsModule,
  ],
  controllers: [AppController],
})
export class ApplicationModule {}
