import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../src/user/user.module';
import appConfig from '../src/config/appConfig';
import dbConfigTest from '../src/config/dbConfigTest';
import jwtConfig from '../src/config/jwtConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { AuthService } from '../src/auth/auth.service';
import { UserRepository } from '../src/user/user.repository';
import { getConnection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig, dbConfigTest, jwtConfig],
          envFilePath: ['.env'],
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => config.get('postgresTest'),
          inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
          useFactory: (config: ConfigService) => config.get('redisTest'),
          inject: [ConfigService],
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors({ origin: app.get(ConfigService).get('app.cors') });
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(async () => {
    if (!getConnection().isConnected) {
      await getConnection().connect();
    }
    await getConnection().synchronize(true);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/user (GET)', async () => {
    const authService = app.get(AuthService);
    const userRepository = app.get(UserRepository);

    // Create user for
    const testUser = await userRepository.create({
      email: 'testUser@example.com',
      name: 'testUser',
      password: 'safePassword',
    });
    await userRepository.save(testUser);

    const token = authService.generateJWT(testUser);

    return request(app.getHttpServer())
      .get('/user')
      .set({ Authorization: 'Bearer ' + token })
      .expect(200);
  });
});
