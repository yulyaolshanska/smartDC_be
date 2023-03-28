import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './modules/doctor/entity/doctor.entity';
import { DoctorModule } from './modules/doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'backend',
      entities: [Doctor],
      synchronize: true,
    }), DoctorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
