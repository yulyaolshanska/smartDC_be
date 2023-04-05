import { Test, TestingModule } from '@nestjs/testing';
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
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
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