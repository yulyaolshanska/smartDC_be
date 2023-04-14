import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import UpdateGoogleDoctorDto from 'modules/doctor/dto/update-google-doctor-dto';
import { Request, Response, CookieOptions } from 'express';
import {
  GOOGLE_TOCKEN_PATH,
  GOOGLE_URL,
  HASH_NUMBER,
  SEVEN,
} from '@shared/consts';
import LoginDoctorDto from '../doctor/dto/login-doctor.dto';

import CreateDoctorDto from '../doctor/dto/create-doctor.dto';
import DoctorService from '../doctor/doctor.service';
import Doctor from '../doctor/entity/doctor.entity';
import { GoogleDoctorResult } from './utils/types';
import MailService from './mail.service';

@Injectable()
export default class AuthService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  private readonly client_id = this.configService.get('GOOGLE_CLIENT_ID');

  private readonly client_secret = this.configService.get('GOOGLE_SECRET');

  private readonly redirect_uri = this.configService.get('GOOGLE_REDIRECT_URL');

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private doctorService: DoctorService,
    private mailService: MailService,
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

  private readonly accessTokenCookieOptions: CookieOptions = {
    maxAge: this.configService.get('ACCESS_TOKEN_MAX_AGE'),
    httpOnly: true,
    domain: this.configService.get('ACCESS_TOKEN_DOMAIN'),
    path: '/',
    sameSite: 'lax',
    secure: false,
  };

  async registration(doctorDto: CreateDoctorDto): Promise<{ token: string }> {
    const doctor = await this.doctorService.getDoctorByEmail(doctorDto.email);
    if (doctor) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const hash = await AuthService.hashPassword(doctorDto);
    const activationLink = uuid.v4();
    const newDoctor = await this.doctorService.createDoctor(
      {
        ...doctorDto,
        password: hash,
      },
      `${this.configService.get('API_URL')}/auth/activation/${activationLink}`,
    );

    await this.mailService.sendActivationMail(
      doctorDto.email,
      `${this.configService.get('API_URL')}/auth/activation/${activationLink}`,
    );
    return this.generateToken(newDoctor);
  }

  private static async hashPassword(
    doctorDto: CreateDoctorDto,
  ): Promise<string> {
    try {
      return await bcrypt.hash(doctorDto.password, HASH_NUMBER);
    } catch (error) {
      throw new Error('Failed to hash the password');
    }
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

  async activation(link: string): Promise<void> {
    const activationLink = `${this.configService.get(
      'API_URL',
    )}/auth/activation/${link}`;
    try {
      const doctor = await this.doctorRepository
        .createQueryBuilder()
        .update(Doctor)
        .set({ isVerified: true })
        .where('doctor.activationLink = :activation_link', {
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
      throw new HttpException(
        'Wrong activation link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleOauthDoctor(req: Request, res: Response): Promise<void> {
    const code = req.query.code as string;
    const { id_token, access_token } = await this.getGoogleOauthTokens({
      code,
    });

    const googleDoctor = await this.getGoogleUser({ id_token, access_token });

    const doctor = await this.validateDoctorFromGoogle(googleDoctor);

    const accessToken = this.jwtService.sign(
      { ...doctor },
      { expiresIn: '8h' },
    );

    res.cookie('accessToken', accessToken, this.accessTokenCookieOptions);
    res.redirect(this.configService.get('CLIENT_URL'));
  }

  private async getGoogleOauthTokens(code: {
    code: string;
  }): Promise<Record<string, string>> {
    const url = GOOGLE_TOCKEN_PATH;
    const values = {
      ...code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      grant_type: 'authorization_code',
    };
    try {
      const qs = new URLSearchParams(values);
      const res = await axios.post(url, qs.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return res.data;
    } catch (error) {
      throw new HttpException(
        'Unable to get oAuth tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async getGoogleUser({
    id_token,
    access_token,
  }): Promise<GoogleDoctorResult> {
    try {
      const res = await axios.get(`${GOOGLE_URL}=${access_token}`, {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async validateDoctorFromGoogle(
    details: GoogleDoctorResult,
  ): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepository
        .createQueryBuilder()
        .select('doctor')
        .from(Doctor, 'doctor')
        .where('doctor.email = :email', { email: details.email })
        .getOne();
      if (!doctor) {
        await this.doctorRepository
          .createQueryBuilder()
          .insert()
          .into(Doctor)
          .values({
            firstName: details.given_name,
            lastName: details.family_name,
            email: details.email,
            isVerified: true,
          })
          .execute();

        this.validateDoctorFromGoogle(details);
      }
      return doctor;
    } catch (error) {
      throw new Error('Unpossible to validate the user');
    }
  }

  // can be used to update doctor profile, can be possobly renamed and used in the future TODO
  updateGoogleDoctorHandler(
    updateGoogleDoctorDto: UpdateGoogleDoctorDto,
    token: string,
  ): void {
    const decodedToken = this.jwtService.verify(
      token.slice(SEVEN),
      this.configService.get('PRIVATE_KEY'),
    );
    this.doctorRepository
      .createQueryBuilder()
      .update(Doctor)
      .set({ ...updateGoogleDoctorDto, isVerified: true })
      .where('doctor.email = :email', { email: decodedToken.email })
      .execute();
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

  async login(doctorDto: LoginDoctorDto): Promise<{ token: string }> {
    try {
      const doctor = await this.validateUser(doctorDto);
      return await this.generateToken(doctor);
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}