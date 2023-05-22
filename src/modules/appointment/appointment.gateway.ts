import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from './types';

@WebSocketGateway({ namespace: 'appointment', cors: true })
export class AppointmentGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppointmentGateway.name);
  constructor() {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('WebSocket init');
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket connected with userID: ${client.doctorId}, firstName: ${client.firstName}, and lastName: "${client.lastName}"`,
    );

    this.logger.log(`Client with id ${client.id} connected`);
    this.logger.debug(`Number of connected sockets ${sockets.size}`);

    this.io.emit('hello', `hello from ${client.id}`);
  }
  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.log(`Client with id ${client.id} disconnected`);
    this.logger.debug(`Number of connected sockets ${sockets.size}`);
  }
}
