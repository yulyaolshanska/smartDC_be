import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DoctorController from './doctor.controller';
import DoctorService from './doctor.service';
import Doctor from './entity/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService, TypeOrmModule.forFeature([Doctor])],
})
export default class DoctorModule {}
