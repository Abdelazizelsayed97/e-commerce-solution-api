import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import compresion from 'compression';
import helmet from 'helmet';

require('dotenv').config({
  path: '.env',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(
    compresion({
      level: 9,
      threshold: 1024,
    }),
  );
  app.use(helmet());
  app.use('/payment/webhook', express.raw({ type: 'application/json' }));
  app.use('/payment/refund', express.raw({ type: 'application/json' }));
  console.log('Running on port ' + process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
