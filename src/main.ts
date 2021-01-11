import { NestFactory } from '@nestjs/core';

import { ApplicationModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  const config = app.get(ConfigService);

  app.enableCors({ origin: config.get('app.cors') });

  await app.listen(config.get<number>('app.listenPort') || 3000);
}

bootstrap();
