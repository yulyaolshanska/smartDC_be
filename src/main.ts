import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
import AppModule from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/uploads', express.static(join(__dirname, '../uploads')));

  const config = new DocumentBuilder()
    .setTitle('Web Wizards api')
    .setDescription('')
    .addBearerAuth()
    .setVersion('1.0')
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(app.get(ConfigService).get('PORT'));
}
bootstrap();
