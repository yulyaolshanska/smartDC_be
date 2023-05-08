import { Module, forwardRef } from '@nestjs/common';
import DoctorModule from 'modules/doctor/doctor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from 'modules/auth/auth.module';
import AvailabilityController from './availability.controller';
import AvailabilityService from './availability.service';
import Availability from './entity/availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Availability]),
    DoctorModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export default class AvailabilityModule {}
