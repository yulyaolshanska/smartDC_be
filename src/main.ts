import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import AppModule from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';
import { SocketIOAdapter } from 'socket-io-adapter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
  });

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  const config = new DocumentBuilder()
    .setTitle('Web Wizards api')
    .setDescription('')
    .setVersion('1.0')
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get('PORT'));
}
bootstrap();
