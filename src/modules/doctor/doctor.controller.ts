import {
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import DoctorService from './doctor.service';
import Doctor from './entity/doctor.entity';
import CreateDoctorDto from './dto/create-doctor.dto';

@Controller('create_doctor')
export default class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({ summary: 'Getting all doctors' })
  @ApiResponse({ status: 200, type: [Doctor] })
  @Get()
  getAll(): Promise<Doctor[]> {
    return this.doctorService.getAllDoctors();
  }

  @ApiOperation({ summary: 'Getting doctor by id' })
  @ApiResponse({ status: 200, type: Doctor })
  @Get('/:id')
  getOne(@Param('id') id: number): Promise<Doctor> {
    return this.doctorService.getDoctorByID(id);
  }

  @ApiOperation({ summary: 'Delete doctor by id' })
  @ApiResponse({ status: 200, type: [Doctor] })
  @Delete('/:id')
  deleteOne(@Param('id') id: number): Promise<void> {
    return this.doctorService.deleteDoctorById(id);
  }

  @Patch('/:id')
  @UseGuards(JwtPatchGuard)
  updateOne(
    @Param('id') id: number,
    @Body() doctorDto: Partial<CreateDoctorDto>,
  ): Promise<Doctor> {
    return this.doctorService.updateDoctor(id, doctorDto);
  }

  @UseGuards(JwtPatchGuard)
  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<Doctor> {
    const filePath = `uploads/${id}/${file.originalname}`;
    await fs.move(file.path, filePath);

    const doctor = await this.doctorService.updateDoctorPhotoUrl(id, filePath);
    return doctor;
  }
}
