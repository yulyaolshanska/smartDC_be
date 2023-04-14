import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from 'modules/auth/auth.module';
import DoctorController from './doctor.controller';
import DoctorService from './doctor.service';
import Doctor from './entity/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), forwardRef(() => AuthModule)],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export default class DoctorModule {}
