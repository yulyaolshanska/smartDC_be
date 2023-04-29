import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import PatientModule from 'modules/patient/patient.module';
import Patient from 'modules/patient/entity/patient.entity';
import Doctor from 'modules/doctor/entity/doctor.entity';
import Note from 'modules/notes/entity/note.entity';
import NotesModule from 'modules/notes/notes.module';
import File from 'modules/notes/entity/file.entity';
import DoctorModule from './modules/doctor/doctor.module';
import AuthModule from './modules/auth/auth.module';

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
        entities: [Doctor, Patient, Note, File],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DoctorModule,
    AuthModule,
    PatientModule,
    NotesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export default class AppModule {}
