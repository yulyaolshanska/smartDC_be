import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import MailService from './mail.service';
import DoctorModule from '../doctor/doctor.module';
import Doctor from '../doctor/entity/doctor.entity';

@Module({
  controllers: [AuthController],
  providers: [{ provide: 'AUTH_SERVICE', useClass: AuthService }, MailService],
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    DoctorModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'doctor',
      session: false,
    }),
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
  exports: [PassportModule, JwtModule],
})
export default class AuthModule {}
