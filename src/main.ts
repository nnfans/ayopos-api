import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  const config = app.get(ConfigService);

  app.enableCors({ origin: config.get('app.cors') });

  const options = new DocumentBuilder()
    .setTitle('AyoPos')
    .setDescription('AyoPos API description')
    .setVersion('0.1')
    .addTag('pos')
    .addTag('inventory')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.get<number>('app.listenPort') || 3000);
}

bootstrap();
