import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import DoctorService from '../doctor/doctor.service';
import Doctor from '../doctor/entity/doctor.entity';
import LoginDoctorDto from '../doctor/dto/login-doctor.dto';

@Injectable()
export default class AuthService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private doctorService: DoctorService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private async generateToken(doctor: Doctor): Promise<{ token: string }> {
    try {
      const payload = { email: doctor.email, id: doctor.id };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new HttpException(
        'Unpossible to generate token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(doctorDto: LoginDoctorDto): Promise<{ token: string }> {
    const doctor = await this.validateUser(doctorDto);
    return this.generateToken(doctor);
  }

  private async validateUser(doctorDto: LoginDoctorDto): Promise<Doctor> {
    try {
      const doctor = await this.doctorService.getDoctorByEmail(doctorDto.email);
      const passwordEquals = await bcrypt.compare(
        doctorDto.password,
        doctor.password,
      );
      if (!doctor) {
        throw new HttpException(
          `Wrong email!`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!passwordEquals) {
        throw new HttpException(
          `Wrong password`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return doctor;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
