import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
  console.log('this is port console log ' + process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

