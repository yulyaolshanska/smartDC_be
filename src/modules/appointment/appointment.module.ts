import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PatientModule from 'modules/patient/patient.module';
import DoctorModule from 'modules/doctor/doctor.module';
import AuthModule from 'modules/auth/auth.module';
import { AppointmentGateway } from 'modules/appointment/appointment.gateway';
import AppointmentController from './appointment.controller';
import AppointmentService from './appointment.service';
import Appointment from './entity/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DoctorModule,
    PatientModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentGateway],
  exports: [AppointmentService],
})
export default class AppointmentModule {}
