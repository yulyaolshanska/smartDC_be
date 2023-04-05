import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import DoctorModule from '../doctor/doctor.module';
import Doctor from '../doctor/entity/doctor.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    DoctorModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('PRIVATE_KEY', 'WEBWIZARDS'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
})
export default class AuthModule {}
