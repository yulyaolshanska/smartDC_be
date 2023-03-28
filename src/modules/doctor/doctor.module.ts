import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entity/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  exports: [TypeOrmModule]
})
export class DoctorModule {}