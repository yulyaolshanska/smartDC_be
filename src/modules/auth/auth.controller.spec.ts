import { Test, TestingModule } from '@nestjs/testing';
import CreateDoctorDto from 'modules/doctor/dto/create-doctor.dto';
import { Gender, Role } from '@shared/enums';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import LoginDoctorDto from '../doctor/dto/login-doctor.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(() => ({ token: 'test_token' })),
            registration: jest.fn(() => ({ token: 'test_token' })),
            activation: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('registration', () => {
    it('should return a token', async () => {
      const userData: CreateDoctorDto = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+380992598283',
        email: 'test@example.com',
        password: 'password',
        specialization: 1,
        gender: Gender.Male,
        city: 'Kharkiv',
        birthDate: '20.01.2000',
        country: 'Ukraine',
        timeZone: 'Berlin/Germany GTM+3',
        address: 'some adress',
        role: Role.Local,
      };

      const result = await controller.registration(userData);

      expect(authService.registration).toHaveBeenCalledWith(userData);
      expect(result).toEqual({ token: 'test_token' });
    });
  });

  describe('activation', () => {
    it('should call authService.activation() with the provided activation link', async () => {
      const activationLink = 'some-activation-link';
      const activationSpy = jest.spyOn(authService, 'activation');

      await controller.activation(activationLink);

      expect(activationSpy).toHaveBeenCalledWith(activationLink);
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const userData: LoginDoctorDto = {
        email: 'test@example.com',
        password: '11111111Qq',
      };

      const result = await controller.login(userData);

      expect(authService.login).toHaveBeenCalledWith(userData);
      expect(result).toEqual({ token: 'test_token' });
    });
  });
});
