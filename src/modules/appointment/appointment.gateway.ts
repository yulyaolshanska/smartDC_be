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

  async handleConnection(client: SocketWithAuth) {
    const { sockets } = this.io;
    this.logger.log(`Client with id ${client.id} connected`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const { sockets } = this.io;

    this.logger.log(`Client with id ${client.id} disconnected`);
    this.logger.debug(`Number of connected sockets ${sockets.size}`);
  }

  @Cron('*/15 * * * * *')
  async joinNextAppointment() {
    const { sockets } = this.io;
    const nextAppointment = await this.appointmentService.startAppointments();

    if (nextAppointment) {
      const localDoctor = [...sockets.values()].find(
        (obj: SocketWithAuth) => obj.doctorId == nextAppointment.localDoctor.id,
      );

      const remoteDoctor = [...sockets.values()].find(
        (obj: SocketWithAuth) =>
          obj.doctorId == nextAppointment.remoteDoctor.id,
      );

      const remoteDoctorSocketId = remoteDoctor?.id;
      const localDoctorSocketId = localDoctor?.id;

      this.appointmentService.deleteAppointments();
      if (remoteDoctorSocketId) {
        this.io
          .to(remoteDoctorSocketId)
          .emit('appointment_update', nextAppointment);
      }
      if (localDoctorSocketId) {
        this.io
          .to(localDoctorSocketId)
          .emit('appointment_update', nextAppointment);
      }
    }
  }
}
