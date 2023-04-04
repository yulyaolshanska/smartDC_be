import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import * as uuid from 'uuid';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import CreateDoctorDto from '../doctor/dto/create-doctor.dto';
import DoctorService from '../doctor/doctor.service';
import Doctor from '../doctor/entity/doctor.entity';
import { HASH_NUMBER } from '../../shared/consts';

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

  async registration(doctorDto: CreateDoctorDto): Promise<{ token: string }> {
    const candidate = await this.doctorService.getDoctorByEmail(
      doctorDto.email,
    );
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const hashPassword = await bcrypt.hash(doctorDto.password, HASH_NUMBER);
    const activationLink = uuid.v4();
    const doctor = await this.doctorService.createDoctor(
      {
        ...doctorDto,
        password: hashPassword,
      },
      `${this.configService.get('API_URL')}/auth/activation/${activationLink}`,
    );

    await this.sendActivationMail(
      doctorDto.email,
      `${this.configService.get('API_URL')}/auth/activation/${activationLink}`,
    );
    return this.generateToken(doctor);
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

  private async sendActivationMail(to: string, link: string): Promise<void> {
    try {
      console.log(link);
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to,
        subject: `Account activation${this.configService.get('API_URL')}`,
        html: `
                <div>
                <h1>"For activation press the link"</h1>
                <a href="${link}">${link}</a>
                </div>
          `,
      });
    } catch (error) {
      throw new HttpException(
        'Can not send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async activation(link: string): Promise<void> {
    const activationLink = `${this.configService.get(
      'API_URL',
    )}/auth/activation/${link}`;
    try {
      const doctor = await this.doctorRepository
        .createQueryBuilder()
        .update(Doctor)
        .set({ is_verified: true })
        .where('doctor.activation_link = :activation_link', {
          activation_link: activationLink,
        })
        .execute();

      if (!doctor) {
        throw new HttpException(
          'Wrong activation link',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Wrong activation link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

//login i used to test registration

// async login(doctorDto: CreateDoctorDto) {
//   const doctor = await this.validateUser(doctorDto);
//   return this.generateToken(doctor);
// }\

// private async validateUser(doctorDto: CreateDoctorDto) {
//   try {
//     const doctor = await this.doctorService.getDoctorByEmail(doctorDto.email);
//     const passwordEquals = await bcrypt.compare(
//       doctorDto.password,
//       doctor.password,
//     );
//     if (doctor && passwordEquals) {
//       return doctor;
//     }
//   } catch (error) {
//     throw new UnauthorizedException({ message: 'Wrong email or password' });
//   }
// }
