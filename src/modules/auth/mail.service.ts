import { Injectable , HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import Doctor from 'modules/doctor/entity/doctor.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
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

  async sendActivationMail(to: string, link: string): Promise<void> {
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
}
