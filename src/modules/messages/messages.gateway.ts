import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Controller } from '@nestjs/common';
import MessagesService from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import Message from './entities/message.entity';

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
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.join(roomId);
  }

  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Message> {
    const message = await this.messagesService.createMessage(createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('typing')
  async handleTypingEvent(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('user') userId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = await this.messagesService.getUserById(userId);
    client.broadcast.emit('typing', { user, isTyping });
  }
}
