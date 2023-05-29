import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MessagesService from './messages.service';
import MessagesGateway from './messages.gateway';
import Message from './entities/message.entity';
import AuthModule from '../auth/auth.module';
import DoctorModule from '../doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    DoctorModule,
    forwardRef(() => AuthModule),
  ],
  providers: [MessagesGateway, MessagesService],
  controllers: [MessagesGateway],
  exports: [MessagesService],
})
export default class MessagesModule {}
