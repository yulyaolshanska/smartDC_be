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
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import JwtPatchGuard from 'modules/auth/utils/PatchGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import DoctorService from './doctor.service';
import Doctor, { Availability } from './entity/doctor.entity';
import CreateDoctorDto from './dto/create-doctor.dto';

@UseGuards(JwtPatchGuard)
@Controller('doctor')
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
  updateOne(
    @Param('id') id: number,
    @Body() doctorDto: Partial<CreateDoctorDto>,
  ): Promise<Doctor> {
    return this.doctorService.updateDoctor(id, doctorDto);
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<Doctor> {
    const filePath = `uploads/${id}/avatar.jpg`;
    await fs.move(file.path, filePath, { overwrite: true });

    const doctor = await this.doctorService.updateDoctorPhotoUrl(id, filePath);
    return doctor;
  }

  @Put('/:id/availability')
  addAvailability(
    @Param('id') doctorId: number,
    @Body() availabilities: Omit<Availability, 'doctorId'>[],
  ): Promise<Availability[]> {
    return this.doctorService.updateDoctorAvailability(
      doctorId,
      availabilities,
    );
  }

  @Delete('/:id/availability/:uuid')
  deleteAvailability(
    @Param('id') doctorId: number,
    @Param('uuid') availabilityUuid: string,
  ): Promise<void> {
    return this.doctorService.deleteDoctorAvailability(
      doctorId,
      availabilityUuid,
    );
  }
}
