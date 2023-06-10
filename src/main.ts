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
    origin: [
      'http://web-wizards-frontend.s3-website.eu-central-1.amazonaws.com',
      'http://localhost:4200',
      'http://localhost:5000',
      'http://ec2-3-68-84-251.eu-central-1.compute.amazonaws.com',
    ],
    allowedHeaders: ['Authorization', 'authorization'],
    exposedHeaders: ['Authorization', 'authorization'],
    credentials: true,
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
