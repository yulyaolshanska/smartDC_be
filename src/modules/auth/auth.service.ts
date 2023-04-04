import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';
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

  // async login(doctorDto: CreateDoctorDto) {
  //   const doctor = await this.validateUser(doctorDto);
  //   return this.generateToken(doctor);
  // }

  async registration(doctorDto: CreateDoctorDto): Promise<{ token: string }> {
    const candidate = await this.doctorService.getDoctorByEmail(
      doctorDto.email,
    );
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(doctorDto.password, HASH_NUMBER);
    const activationLink = `${this.configService.get(
      'API_URL',
    )}/auth/activation/${uuid.v4()}`;
    const doctor = await this.doctorService.createDoctor(
      {
        ...doctorDto,
        password: hashPassword,
      },
      activationLink,
    );

    await this.sendActivationMail(doctorDto.email, activationLink);
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

  private async sendActivationMail(to: string, link: string): Promise<void> {
    try {
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
    try {
      const doctor = await this.doctorRepository.findOne({
        where: {
          activation_link: `${this.configService.get(
            'API_URL',
          )}/auth/activation/${link}`,
        },
      });
      if (!doctor) {
        throw new HttpException(
          'Wrong activation link',
          HttpStatus.BAD_REQUEST,
        );
      }
      doctor.is_verified = true;
      await this.doctorRepository.save(doctor);
    } catch (error) {
      throw new HttpException(
        'Not possible to activate account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
