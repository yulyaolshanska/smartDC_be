import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SocketIOAdapter } from 'socket-io-adapter';
import { join } from 'path';
import * as express from 'express';
import AppModule from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
  });

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
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

  await app.listen(configService.get('PORT'));
}
bootstrap();
