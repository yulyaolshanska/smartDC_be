import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from 'modules/auth/auth.module';
import PatientService from './patient.service';
import PatientController from './patient.controller';
import Patient from './entity/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), forwardRef(() => AuthModule)],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export default class PatientModule {}
