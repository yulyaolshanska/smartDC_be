import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import Doctor from 'modules/doctor/entity/doctor.entity';
import AuthService from '../auth.service';

@Injectable()
export default class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID:
        '922767752665-vnleaigg45gddmdb90rkbvq6r4ce9c6k.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5000/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<Doctor> {
    console.log(accessToken, refreshToken, profile);
    const doctor = await this.authService.validateDoctorFromGoogle({
      firstName: profile._json.given_name, // eslint-disable-line no-underscore-dangle
      lastName: profile._json.family_name, // eslint-disable-line no-underscore-dangle
      email: profile._json.email, // eslint-disable-line no-underscore-dangle
    });
    console.log('Validate');
    console.log(doctor);
    return doctor || null;
  }
}
