import { Controller, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import AuthService from './auth.service';
import Doctor from '../doctor/entity/doctor.entity';
import LoginDoctorDto from '../doctor/dto/login-doctor.dto';

@ApiTags('Authorization')
@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Doctor login' })
  @ApiResponse({ status: 201, type: Doctor })
  @Post('/login')
  async login(@Body() doctorDto: LoginDoctorDto): Promise<{ token: string }> {
    return this.authService.login(doctorDto);
  }
}
export default AuthController;
