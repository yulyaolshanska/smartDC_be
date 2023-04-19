import {
  Controller,
  Body,
  Post,
  Redirect,
  Param,
  Get,
  Req,
  Inject,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import UpdateGoogleDoctorDto from 'modules/doctor/dto/update-google-doctor-dto';
import Doctor from '../doctor/entity/doctor.entity';
import AuthService from './auth.service';
import LoginDoctorDto from '../doctor/dto/login-doctor.dto';

import CreateDoctorDto from '../doctor/dto/create-doctor.dto';
import JwtAuthGuard from './utils/Guards';
import { UserInfo } from './utils/types';

@ApiTags('Authorization')
@Controller('auth')
class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Doctor registration' })
  @ApiResponse({ status: 201, type: Doctor })
  @Post('/registration')
  async registration(
    @Body() doctorDto: CreateDoctorDto,
  ): Promise<{ token: string }> {
    return this.authService.registration(doctorDto);
  }

  @ApiOperation({ summary: 'Google Login' })
  @ApiResponse({ status: 201, type: Doctor })
  @Get('/google/redirect')
  async handleRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Doctor> {
    return this.authService.handleOauthDoctor(req, res);
  }

  @Post('/google/update')
  @UseGuards(JwtAuthGuard)
  async updateGoogleDoctor(
    @Body() updateGoogleDoctorDto: UpdateGoogleDoctorDto,
    @Req() req: Request,
  ): Promise<void> {
    return this.authService.updateGoogleDoctorHandler(
      updateGoogleDoctorDto,
      req.headers.authorization,
    );
  }

  @ApiOperation({ summary: 'Account activation' })
  @ApiResponse({ status: 201, type: Doctor })
  @Get('/activation/:link')
  @Redirect('https://nestjs.com') // TODO change value
  async activation(@Param('link') link: string): Promise<void> {
    return this.authService.activation(link);
  }

  @ApiOperation({ summary: 'Doctor login' })
  @ApiResponse({ status: 201, type: Doctor })
  @Post('/login')
  async login(@Body() doctorDto: LoginDoctorDto): Promise<{ token: string }> {
    return this.authService.login(doctorDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request): Promise<UserInfo> {
    return this.authService.getMe(req);
  }
}
export default AuthController;
