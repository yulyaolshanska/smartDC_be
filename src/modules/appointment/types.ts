import { Request } from 'express';
import { Socket } from 'socket.io';

type AuthPayload = {
  doctorId: number;
  firstName: string;
  lastName: string;
};
export type SocketWithAuth = Socket & AuthPayload;
