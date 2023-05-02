import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import PatientModule from 'modules/patient/patient.module';
import Patient from 'modules/patient/entity/patient.entity';
import Doctor from 'modules/doctor/entity/doctor.entity';
import Appointment from 'modules/appointment/entity/appointment.entity';
import AppointmentModule from 'modules/appointment/appointment.module';
import AuthModule from './modules/auth/auth.module';
import DoctorModule from './modules/doctor/doctor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        entities: [Doctor, Patient, Appointment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DoctorModule,
    AuthModule,
    PatientModule,
    AppointmentModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export default class AppModule {}
