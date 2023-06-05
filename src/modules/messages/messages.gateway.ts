import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Body, Controller } from '@nestjs/common';
import * as fs from 'fs-extra';
import MessagesService from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import Message from './entities/message.entity';
import { UploadFileDto } from './dto/upload-file.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Controller()
export default class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() doctor: Socket,
  ): Promise<void> {
    doctor.join(roomId);
  }

  @SubscribeMessage('createMessage')
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Body() uploadFileDto: UploadFileDto,
    @ConnectedSocket() doctor: Socket,
  ): Promise<Message> {
    const filePaths: string[] = [];

    if (uploadFileDto.files) {
      uploadFileDto.files.forEach((file) => {
        const buffer = Buffer.from(file.file, 'base64');
        const filePath = `uploads/${file.fileName}`;
        try {
          fs.writeFileSync(filePath, buffer);
        } catch (err) {
          throw new Error('Error writing file');
        }
        filePaths.push(filePath);
      });
    }

    const fileNames = uploadFileDto.files.map((item) => item.fileName) ?? [];

    const message = await this.messagesService.createMessage({
      ...createMessageDto,
      file: filePaths,
      fileName: fileNames,
    });

    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('typing')
  async handleTypingEvent(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('user') doctorId: number,
    @ConnectedSocket() doctor: Socket,
  ): Promise<void> {
    const user = await this.messagesService.getUserById(doctorId);
    doctor.broadcast.emit('typing', { user, isTyping });
  }
}
