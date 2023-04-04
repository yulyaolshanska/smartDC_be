import { Test, TestingModule } from '@nestjs/testing';
import CreateDoctorDto from 'modules/doctor/dto/create-doctor.dto';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { HttpException } from '@nestjs/common/exceptions';

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
        phone: '+380992598283',
        email: 'test@example.com',
        password: 'password',
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
});
