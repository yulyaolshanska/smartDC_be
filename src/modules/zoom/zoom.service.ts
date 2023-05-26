import { Injectable } from '@nestjs/common';
import axios from 'axios';
import base64url from 'base64url';

const KJUR = require('jsrsasign');

@Injectable()
export class ZoomService {
  async handleSignature(credentials) {
    console.log(credentials);
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    const oHeader = { alg: 'HS256', typ: 'JWT' };

    const oPayload = {
      app_key: '2lSGg5ZDoaxnBiFhlQigSinXOOZ4n7Zuc5iJ',
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
      '3y5TdXlqTkPfcvkGiVd977ycGJoKhH00NpEX',
    );
    console.log(signature);
    return signature;
  }

  async handleZoomOauth() {
    await this.getZoomAccessToken();
  }

  private async getZoomAccessToken() {
    try {
      const authorizationString = Buffer.from(
        'ik85rKm7QzyD1tgGMVlexg' + ':' + 'y9vlsPh1YJ7hdPJairG0M2NiEaoUpvsa',
      ).toString('base64');
      console.log(authorizationString);
      return await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=ik85rKm7QzyD1tgGMVlexg`,
        null,
        {
          headers: {
            ' Authorization': `${authorizationString}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
