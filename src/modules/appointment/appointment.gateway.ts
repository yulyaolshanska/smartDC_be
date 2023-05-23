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
    const {sockets} = this.io;

    this.logger.log(`Client with id ${client.id} connected`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const {sockets} = this.io;

    this.logger.log(`Client with id ${client.id} disconnected`);
    this.logger.debug(`Number of connected sockets ${sockets.size}`);
  }

  @Cron('*/5 * * * * *')
  async joinNextAppointment() {
    const {sockets} = this.io;
    const nextAppointment = await this.appointmentService.startAppointments();

    const localDoctor = [...sockets.values()].find(
      (obj: SocketWithAuth) => obj.doctorId == nextAppointment.localDoctorId,
    );

    const remoteDoctor = [...sockets.values()].find(
      (obj: SocketWithAuth) => obj.doctorId == nextAppointment.remoteDoctorId,
    );

    this.appointmentService.deleteAppointments();

    console.log(localDoctor.id);
    console.log(remoteDoctor.id);
    console.log(nextAppointment);

    if (nextAppointment) {
      this.io.emit('appointment_update', nextAppointment);
      return nextAppointment;
    }
  }
}
