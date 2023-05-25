import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import base64url from 'base64url';

const KJUR = require('jsrsasign');

@Injectable()
export class ZoomService {
  constructor(private configService: ConfigService) {}
  async handleSignature(credentials): Promise<string> {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    const oHeader = { alg: 'HS256', typ: 'JWT' };

    const oPayload = {
      app_key: this.configService.get('APP_KEY'),
      tpc: credentials.tpc,
      role_type: credentials.role_type,
      user_identity: credentials.user_identity,
      session_key: credentials.session_key,

      version: 1,
      iat,
      exp,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const signature = KJUR.jws.JWS.sign(
      'HS256',
      sHeader,
      sPayload,
      this.configService.get('APP_SECRET'),
    );
    return signature;
  }
}
