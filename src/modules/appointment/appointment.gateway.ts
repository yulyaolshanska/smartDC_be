import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from './types';

import AppointmentService from './appointment.service';

@WebSocketGateway({ namespace: 'appointment', cors: true })
export class AppointmentGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppointmentGateway.name);

  constructor(private appointmentService: AppointmentService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('WebSocket init');
  }

  async handleConnection(client: SocketWithAuth): Promise<void> {
    this.logger.log(`Client with id ${client.id} connected`);
  }

  async handleDisconnect(client: SocketWithAuth): Promise<void> {
    const { sockets } = this.io;

    this.logger.log(`Client with id ${client.id} disconnected`);
    this.logger.debug(`Number of connected sockets ${sockets.size}`);
  }

  @Cron('*/5 * * * * *')
  async joinNextAppointment(): Promise<void> {
    const { sockets } = this.io;
    const nextAppointment =
      (await this.appointmentService.startAppointments()) as any;
    console.log(nextAppointment);

    if (nextAppointment) {
      const localDoctorSocket = [...sockets.values()].find(
        (obj: SocketWithAuth) => obj.doctorId == nextAppointment.localDoctorId,
      );

      const remoteDoctorSocket = [...sockets.values()].find(
        (obj: SocketWithAuth) => obj.doctorId == nextAppointment.remoteDoctorId,
      );

      const remoteDoctorSocketId = remoteDoctorSocket?.id;

      const localDoctorSocketId = localDoctorSocket?.id;

      const roomName = this.appointmentService.getRoomName(
        nextAppointment.id,
        nextAppointment.startTime,
      );

      this.appointmentService.deleteAppointments();
      if (remoteDoctorSocketId) {
        this.io
          .to(remoteDoctorSocketId)
          .emit('appointment_update', { nextAppointment, roomName });
      }
      if (localDoctorSocketId) {
        this.io
          .to(localDoctorSocketId)
          .emit('appointment_update', { nextAppointment, roomName });
      }
    }
  }
}
