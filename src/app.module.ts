import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import AppController from './app.controller';
import AppService from './app.service';
import DoctorModule from './modules/doctor/doctor.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        synchronize: false,
      }),
    }),
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
